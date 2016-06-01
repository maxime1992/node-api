export default (socket) => {
	socket.emit('news', {hello: 'world'});
	
	setInterval(function () {
		socket.emit('send:time', {
			time: (new Date()).toString()
		});
	}, 1000);

	// notify other clients that a new user has joined
	socket.broadcast.emit('user:join', {
		name: 'name'
	});

	// broadcast a user's message to other users
	socket.on('send:message', function (data) {
		socket.broadcast.emit('send:message', {
			user: 'name',
			text: data.message
		});
	});


	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function () {
		// socket.broadcast.emit('user:left', {
		//   name: name
		// });
		// userNames.free(name);
	});
};
