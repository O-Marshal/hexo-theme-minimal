$(function () {
	$('.project-item.project').on('touch click', function () {
		window.location.href = $(this).data('url');
	});
});