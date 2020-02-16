package edu.uci.ics.texera.web.resource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

public final class UserMysqlServer {
    public final static String SERVER_NAME = "root";
    public final static String PASSWORD = "PassWithWord";
    public final static String URL = "jdbc:mysql://localhost:3306/texera?serverTimezone=UTC";
    public final static SQLDialect SQL_DIALECT= SQLDialect.MYSQL;
    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
                URL, 
                SERVER_NAME, 
                PASSWORD);
    }
    
    public static DSLContext createDSLContext(Connection conn) {
        return DSL.using(conn, SQL_DIALECT);
    }
}
