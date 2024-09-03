import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as d3 from 'd3';
import { getBezierPath, Position } from './bezier-edge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'playground';
  edgeId = "id-edge";
  sourceElement: SVGRectElement | null = null;
  targetElement: SVGRectElement | null = null;
  startPoint: { x: number, y: number } | null = null;
  endPoint: { x: number, y: number } | null = null;

  isdrawing = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {

    const endPoint = { x: event.clientX, y: event.clientY };

    if (this.isdrawing &&
      (!this.endPoint || (endPoint && (endPoint.x !== this.endPoint.x || endPoint.y !== this.endPoint.y)))) {
      this.endPoint = endPoint;
      this.clearSvgPath(this.edgeId);
      this.drawLine();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {

    if (this.isdrawing && event.target instanceof SVGRectElement) {
      console.log("currentTarget", event.target);
      this.targetElement = event.target as SVGRectElement;
      this.isdrawing = false;
      this.endPoint = { x: event.clientX, y: event.clientY };
      this.clearSvgPath(this.edgeId);
      this.drawLine();
    } else {
      console.log("currentTarget", event.target);
      this.isdrawing = false;
      this.clearSvgPath(this.edgeId);
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isdrawing = true;
    this.sourceElement = event.target as SVGRectElement;
    this.startPoint = { x: event.clientX, y: event.clientY };
  }


  drawLine() {
    const svg = d3.select("svg");

    const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({ sourceX: this.startPoint.x, sourcePosition: Position.Right, targetPosition: Position.Left, sourceY: this.startPoint.y, targetX: this.endPoint.x, targetY: this.endPoint.y });

    svg
      .append("path")
      .attr("id", this.edgeId)
      .attr("d", path)
      .attr("stroke-width", "2px")
      .attr("fill", "none")
      .attr("stroke", "#f5f5f5");

  }

  clearSvgPath(pathId: string) {
    const svg = d3.select("svg");
    svg.select("#" + pathId).remove();
  }




}
