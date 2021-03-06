var schedule = [
	{
		name: 'Math',
		block: '1',
		id: 123456,
		from: '7:30',
		to: '8:00',
		teacher: 'Ms. Sweeney'
	},
	{
		name: 'Chemistry',
		block: '2',
		id: 789012,
		from: '8:03',
		to: '11:50',
		teacher: 'Ms. Dormer'
	}
];
var assignments = [
	{
		name: 'Worksheet 1.3',
		className: 'Math',
		type: 'Worksheet',
		assigned: '11/11/15',
		due: '11/13/15',
		status: 'Overdue'
	},
	{
		name: 'P.180-182 #1-43 (odd)',
		className: 'Math',
		type: 'Homework',
		assigned: '11/12/15',
		due: '11/13/15',
		status: 'Assigned'
	},
	{
		name: 'Essay',
		className: 'Chemistry',
		type: 'Paper',
		assigned: '11/10/15',
		due: '11/13/15',
		status: 'Submitted'
	}
];
$(function() {
	$.material.init();
	//setup navbar
	$('.navbar-page-button-schedule').on('pointer.short',function(e) {
		console.info('short');
		try {
			window.history.replaceState(null, null, $(this).attr('href'));
		}catch(e){
			//fallback if it doesn't support the History API
			window.location = $(this).attr('href');
		}
	}).on('pointer.long', function(e){
		console.info('long');
		var $this = $(this)
		$this
			.attr('aria-expanded','true')
			.focus()
			.removeClass('open dropdown-item-selected')
			.focus(function() {
				$this.removeClass('open');
			}).blur(function(e) {
				if (e.relatedTarget !== null && $(e.relatedTarget).is('.navbar-page-button-schedule [data-nofocus="true"], .navbar-page-button-schedule [data-nofocus="true"] *')) {
					//cancel close because a child element not an item was focused
					$this.addClass('open');//force open (cancel close from blur)
					$(e.relatedTarget).one('focus', function() {//when the child is focused, switch focus back to me
						$this.focus();
					});
				} else if (e.relatedTarget !== null && $(e.relatedTarget).is('.navbar-page-button-schedule *')) {
					//close because one of the items was clicked
					$this.addClass('dropdown-item-selected').removeClass('open');
				} else {
					//close because something was clicked outside of the dropdown
					$this.removeClass('open dropdown-item-selected');
				}
			});
	});
	$('.navbar.navbar-default .navbar-collapse').on('pointer.short', function(e) {
		console.log(e.target);
		if ($(window).width()<768)
			setTimeout(function() {
				$('.navbar-toggle:not(.collapsed)').click();
			}, 500);
	});
	var scheduleView = new StudentScheduleView(schedule);
	var assignmentsView = new StudentAssignmentView(assignments);
	var loginView = new LoginView();
	var views = [loginView, scheduleView, assignmentsView];
	$(window).on('hashchange',function() {
		var hash = window.location.hash;
		if (hash.length <= 1) {
			$('[data-active-hash=\'\'],[data-active-hash=\'#\']').addClass('hash-active');
			$('.hash-active:not([data-active-hash=\'\']):not([data-active-hash=\'#\'])').removeClass('hash-active');
			hash = null;
		} else {
			$('[data-active-hash=\''+hash+'\']').addClass('hash-active');
			$('.hash-active:not([data-active-hash=\''+hash+'\']').removeClass('hash-active');
			hash = hash.substring(1);
		}
		views.forEach(function(view) {
			view.disable();
		});
		switch(hash) {
			case "schedule":
				scheduleView.init().then(function(){scheduleView.enable();});
				break;
			case "assignments":
				assignmentsView.init().then(function(){assignmentsView.enable();});
				break;
			case "login":
			case null:
				loginView.init().then(function(){loginView.enable();});
		}
	}).trigger('hashchange');//to initialize w/ current hash
});