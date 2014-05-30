var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('taskdb', server);

db.open(function(err, db){
	if(!err){
		console.log('Connected to "taskdb" database');
		db.collection('tasks', {strict:true}, function(err, collection){
			if(err){
				console.log('The "tasks" collection does not exist. Creating it with sample data...');
				load_data();
			}
		});
	}
});

var load_data = function(){
	var tasks = [
		{
			taskName: "Crawling Hands",
			taskAmount: 40,
			taskNumber: 1,
			taskNoteworthyDrop: "A crawling hand!"
		}
	];

	db.collection('tasks', function(err, collection){
		collection.insert(tasks, {safe:true}, function(err, result){});
	});
};

exports.get_all = function(cb){
	db.collection('tasks', function(err, collection){
		collection.find().toArray(function(err, items){
			cb(null, items);
		});
	});
};

// exports.get_by_id = function(req, res){var id = req.params.id; console.log('Retrieving taskid: ' + id); db.collection('tasks', function(err, collection){collection.findOne({'taskNumber':taskNum}, function(err, item){res.send(item); }); }); };

exports.add_task = function(task, cb){
	console.log('Adding task: ' + task);
	db.collection('tasks', function(err, collection){
		collection.insert(task, {safe:true}, function(err, result){
			if(err){
				cb({'error':'An error has occurred'});
			}else{
				console.log('Success: ' + JSON.stringify(result[0]));
				cb({'success':'Added task'});
			}
		});
	});
};

exports.delete_task = function(req, res) {
    var id = req.params.body;
    console.log('Deleting task: ' + id);
    db.collection('tasks', function(err, collection) {
        collection.remove({'_id':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
// exports.update_task = function(req, res){var id = req.params.id; var task = req.body; console.log('Updating taskid: ' + id); console.log(JSON.stringify(task)); db.collection('tasks', function(err, collection){collection.update({'_id': id}, task, {safe:true}, function(err, result){if(err){console.log('Error updating task: ' + err); res.send({'error':'An error has occurred'}); }else{console.log('' + result + ' document(s) updated'); res.send(task); } }); }); };