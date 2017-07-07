/*
Script to include iframe to show pretty source
*/
var el = document.getElementById('psource');
var src = false;
var host = window.location.protocol + '//' + window.location.hostname;

if (el) {
	src = el.getAttribute('data-srcfile')
}
if (!src) {
	src = window.location.href;
}
document.write('<h4>Source Code</h4><iframe class="source-window" src="' + host + '/ee/source.php?src=' + src + '"></iframe>');
