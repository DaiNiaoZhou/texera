import { Component, OnInit, NgModule } from '@angular/core';
import { ExecuteWorkflowService } from './../../service/execute-workflow/execute-workflow.service';
import { TourService } from 'ngx-tour-ng-bootstrap';
import { DragDropService } from './../../service/drag-drop/drag-drop.service';
import { Observable } from 'rxjs';
/**
 * NavigationComponent is the top level navigation bar that shows
 *  the Texera title and workflow execution button
 *
 * This Component will be the only Component capable of executing
 *  the workflow in the WorkflowEditor Component.
 *
 * Clicking the run button on the top-right hand corner will begin
 *  the execution. During execution, the run button will be unavailble
 *  and a spinner will be displayed to show that graph is under execution.
 *
 * @author Zuozhi Wang
 * @author Henry Chen
 *
 */
@Component({
  selector: 'texera-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {

  // zoomDifference represents the ratio that is zoom in/out everytime.
  public static readonly ZOOM_DIFFERENCE: number = 0.02;

  // variable binded with HTML to decide if the running spinner should show
  public showSpinner = false;

  // the newZoomRatio represents the ratio of the size of the the new window to the original one.
  private newZoomRatio: number = 1;


  constructor(private dragDropService: DragDropService,
    private executeWorkflowService: ExecuteWorkflowService, public tourService: TourService) {
    // hide the spinner after the execution is finished, either
    //  when the value is valid or invalid
    executeWorkflowService.getExecuteEndedStream().subscribe(
      value => this.showSpinner = false,
      error => this.showSpinner = false
    );
  }

  ngOnInit() {
    /**
     * Get the new value from the mouse wheel zoom function.
     */
    this.dragDropService.getWorkflowEditorZoomStream().subscribe(
      newRatio => {
          this.newZoomRatio = newRatio;
    });
  }

  /**
   * Executes the current existing workflow on the JointJS paper. It will
   *  also set the `showSpinner` variable to true to show that the backend
   *  is loading the workflow by addding a active spinner next to the
   *  run button.
   */
  public onClickRun(): void {
    // show the spinner after the "Run" button is clicked
    this.showSpinner = true;
    this.executeWorkflowService.executeWorkflow();
  }

  public onClickUtility(): void {
    // initial version, default index is 0;
    this.dragDropService.setUtilityIndex(0);
  }

  /**
   * send the offset value to the work flow editor panel using drag and drop service.
   * when users click on the button, we change the zoomoffset to make window larger or smaller.
  */
  public onClickZoomIn(): void {
    // make the ratio small.
    this.newZoomRatio += NavigationComponent.ZOOM_DIFFERENCE;
    this.dragDropService.setZoomProperty(this.newZoomRatio);
  }
  public onClickZoomOut(): void {
    // make the ratio big.
    this.newZoomRatio -= NavigationComponent.ZOOM_DIFFERENCE;
    this.dragDropService.setZoomProperty(this.newZoomRatio);
  }
}
