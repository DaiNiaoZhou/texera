package edu.uci.ics.texera.web.resource;

import static org.jooq.impl.DSL.defaultValue;

import java.io.InputStream;
import java.nio.file.Paths;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.Record3;
import org.jooq.Result;

import static edu.uci.ics.texera.web.resource.generated.Tables.*;
import static org.jooq.impl.DSL.*;

import edu.uci.ics.texera.web.TexeraWebException;
import edu.uci.ics.texera.web.resource.generated.tables.records.UseraccountRecord;
import edu.uci.ics.texera.web.resource.generated.tables.records.UserfileRecord;
import edu.uci.ics.texera.web.response.GenericWebResponse;
import edu.uci.ics.texera.dataflow.resource.file.FileManager;

@Path("/users/files/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserFileResource {
    
    public static class UserFile {
        public double id;
        public String name;
        public String path;
        public String description;

        public UserFile(double id, String name, String path, String description) {
            this.id = id;
            this.name = name;
            this.path = path;
            this.description = description;
        }
    }
        
    /**
     * This method will handle the request to upload a single file.
     * 
     * @param uploadedInputStream
     * @param fileDetail
     * @return
     */
    @POST
    @Path("/upload-file/{userID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public GenericWebResponse uploadDictionaryFile(
            @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("file") FormDataContentDisposition fileDetail,
            @PathParam("userID") String userID) {

        String fileName = fileDetail.getFileName();
        this.handleFileUpload(uploadedInputStream, fileName, userID);
        
        return new GenericWebResponse(0, "success");
    }
    
    @GET
    @Path("/get-files/{userID}")
    public List<UserFile> getUserFiles(@PathParam("userID") String userID){
        double userIDDouble = parseStringToDouble(userID);
        
        Result<Record3<Double, String, String>> result = getUserFileRecord(userIDDouble);
        
        if (result == null) return new ArrayList<>();
        
        List<UserFile> fileList = result.stream()
                .map(
                    record -> new UserFile(
                            record.get(USERFILE.FILEID),
                            record.get(USERFILE.FILENAME),
                            record.get(USERFILE.FILEPATH),
                            "" // TODO get description
                            )
                        ).collect(Collectors.toList());
        
        return fileList;
    }
    
    @DELETE
    @Path("/delete-file/{fileID}")
    public GenericWebResponse deleteUserFiles(@PathParam("fileID") String fileID) {
        double fileIDDouble = parseStringToDouble(fileID);
        Record1<String> result = deleteInDatabase(fileIDDouble);
        
        if (result == null) throw new TexeraWebException("The file does not exist");
        
        String filePath = result.get(USERFILE.FILEPATH);
        FileManager.getInstance().deleteFile(Paths.get(filePath));
        
        return new GenericWebResponse(0, "success");
    }
    
    private Record1<String> deleteInDatabase(double fileID) {
        // Connection is AutoCloseable so it will automatically close when it finishes.
        try (Connection conn = UserMysqlServer.getConnection()) {
            DSLContext create = UserMysqlServer.createDSLContext(conn);
            
            /**
             * Known problem for jooq 3.x
             * delete...returning clause does not work properly
             * retrieve the filepath first, then delete it.
             */
            Record1<String> result = create
                    .select(USERFILE.FILEPATH)
                    .from(USERFILE)
                    .where(USERFILE.FILEID.eq(fileID))
                    .fetchOne();
            
            int count = create
                    .delete(USERFILE)
                    .where(USERFILE.FILEID.eq(fileID))
                    //.returning(USERFILE.FILEPATH) does not work
                    .execute();
            
            if (count == 0) throw new TexeraWebException("delete file " + fileID + " failed in database");
            
            return result;
            
        } catch (Exception e) {
            throw new TexeraWebException(e);
        }
    }
    
    private Result<Record3<Double, String, String>> getUserFileRecord(double userID) {
        // Connection is AutoCloseable so it will automatically close when it finishes.
        try (Connection conn = UserMysqlServer.getConnection()) {
            DSLContext create = UserMysqlServer.createDSLContext(conn);
            
            Result<Record3<Double, String, String>> result = create
                    .select(USERFILE.FILEID, USERFILE.FILENAME, USERFILE.FILEPATH) // TODO description
                    .from(USERFILE)
                    .where(USERFILE.USERID.equal(userID))
                    .fetch();
            
            return result;
            
        } catch (Exception e) {
            throw new TexeraWebException(e);
        }
    }
    
    private void handleFileUpload(InputStream fileStream, String fileName, String userID) {
        double userIDDouble = parseStringToDouble(userID);
        checkFileNameValid(fileName);
        
        int result = insertFileToDataBase(
                fileName, 
                FileManager.getFilePath(userID, fileName).toString(),
                userIDDouble);
        
        if (result == 0) {
            throw new TexeraWebException("Error occurred while inserting file record to database");
        }
        
        FileManager.getInstance().storeFile(fileStream, fileName, userID);
    }
    
    private double parseStringToDouble(String userID) throws TexeraWebException {
        try {
            return Double.parseDouble(userID);
        } catch (NumberFormatException e) {
            throw new TexeraWebException("Incorrect String to Double");
        }
    }
    
    
    private int insertFileToDataBase(String fileName, String path, double userID) {
        // Connection is AutoCloseable so it will automatically close when it finishes.
        try (Connection conn = UserMysqlServer.getConnection()) {
            DSLContext create = UserMysqlServer.createDSLContext(conn);
            
            int result = create.insertInto(USERFILE)
                    .set(USERFILE.USERID,userID)
                    .set(USERFILE.FILEID, defaultValue(USERFILE.FILEID))
                    .set(USERFILE.FILENAME, fileName)
                    .set(USERFILE.FILEPATH, path)
                    //.set(USERFILE.DESCRIPTION, "")
                    .execute();
            
            return result;
            
        } catch (Exception e) {
            throw new TexeraWebException(e);
        }
    }
    
    private void checkFileNameValid(String fileName) throws TexeraWebException {
        if (fileName == null || fileName.length() == 0) {
            throw new TexeraWebException("File name invalid");
        }
    }
}