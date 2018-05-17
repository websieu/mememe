import { Component } from '@angular/core';

@Component({
	templateUrl: '../html/daico.component.html',
	styleUrls: [
		'../css/daico.component.css',
		// "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.7/jquery.fullpage.css",
		'../css/daico.particles.component.css'
	],
	providers: []
})

export class DaicoComponent {

	constructor() {
		var self = this;
		
		var $triangles = document.querySelectorAll('.triangle');
		var template = '<svg class="triangle-svg" viewBox="0 0 140 141">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n      <polygon class="triangle-polygon"  points="70 6 136 138 4 138"></polygon>\n    </g>\n  </svg>';
		Array.prototype.forEach.call($triangles, function ($triangle, index) {
			$triangle.innerHTML = template;
		});
	}
}