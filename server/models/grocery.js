'use strict';

module.exports = function(Grocery) {

	Grocery.validatesPresenceOf(
		// 'departments',
		'img', 'desc', 'slug'
	);

	Grocery.observe('update', function(ctx, next){
		ctx.instance.updated_at = new Date();
		next();
	});

	Grocery.observe("before save", function updateTimestamp(ctx, next) {

		if( ctx.isNewInstance ){
			ctx.instance.created_at = new Date();
			ctx.instance.updated_at = new Date();
		} 



		next();
	});

	// when we call this method - we know that this grocery is attached to user,
	// so it's not so important to check relations between this grocery and user

	Grocery.fetchById = function(groceryId, cb){

		Grocery.findById(groceryId, {
			include: {
				relation: 'departmentsList',
				scope: {
					fields: [ 'id', 'name' ],
					include: {
						relation: 'ingredients',
						scope: {
							fields: [ 'id', 'name' ],

						}
					}

				}
			}

		}, function(err, grocery){

			var g = grocery.toJSON();
			// console.log(grocery);
			cb(null, g);

			// var departments = [];

			// userId
			// User.findById(userId, {}, function(err, model){
   //            console.log(model);
   //            console.log(model.groceryIds);
   //         });



			// g.departmentsList.forEach(function(item, i){

			// 	console.log(item);
			// 	console.log(item.ingredients);

			// 	// item.ingredients.forEach(function(ingredient))

			// 	// case #1 return only dep name with id for link creation
			// 	// console.log(item.name);
			// 	// console.log(item.id);
			// 	// console.log(item.visible);
			// 	// console.log(item.ingredients.length > 0);
			// 	// departments.push({ id: item.id, name: item.name });

				
			// });




		});



	};

	// :todo not sure what i mean by this.
	Grocery.fetch = function(cb){


		Grocery.findOne({
			include: {
				relation: 'departmentsList',
				scope: {
					fields: [ 'name' ],
					include: {
						relation: 'ingredients',
						scope: {
							fields: [ 'name' ],
							// where: {
							// 	departmentId: id
							// }
						}
					}

				}
			}

		}, function(err, grocery){

			// console.log(grocery);

			var g = grocery.toJSON();
			
			var departments = [];
			// console.log(g.desc);
			// console.log(g.departmentsList);

			// case #1 return only dep name with id for link creation
			g.departmentsList.forEach(function(item, i){

				// case #1 return only dep name with id for link creation
				// console.log(item.name);
				// console.log(item.id);
				// console.log(item.visible);
				// console.log(item.ingredients.length > 0);
				departments.push({ id: item.id, name: item.name });

				
			});


			// console.log(departments);
			// object.departments = departments;

			// case #2 display deps with ings
			// g.departmentsList.forEach(function(item, i){
			// 	// console.log(item);

			// 	console.log(item.name);
			// 	console.log(item.id);
			// 	console.log(item.visible);
			// 	console.log(item.ingredients.length > 0);

			// 	// console.log(item.ingredients);

				
			// })

			
			var object = {
				desc: g.desc,
				departments:departments
			};
			cb(null, object);
				

		});


		// .then(function(grocery){


		// 	var g = grocery.toJSON();
		// 	console.log(g.desc);
		// 	console.log(g.departmentsList);

			
		// 	// console.log(g.departmentsList.ingredients);

		// 	g.departmentsList.forEach(function(item, i){
		// 		// console.log(item);
		// 		// console.log(item);

		// 		// case #1 return only dep name with id for link creation
		// 		console.log(item.name);
		// 		console.log(item.id);
		// 		console.log(item.visible);
		// 		console.log(item.ingredients.length > 0);


		// 		// case #2 display deps with ings
		// 		// console.log(item.ingredients);
		// 	})
		// 	// console.log(grocery.departmentsList);



		// });










	};



	// Grocery.remoteMethod('fetch', {
	// 	returns: {
	// 	  arg: 'groceries',
	// 	  type: 'array'
	// 	},
	// 	http: {
	// 	  path: '/list/',
	// 	  verb: 'get'
	// 	}
	// });	



	// @TODO if we have empty menuId then we need to get groceries for the latest(read current active menu);

	Grocery.groceryListForMenu = function(menuId, cb){


		// var Menu = Grocery.app.models.Menu;

		// Menu.MenuRecipesIngredients(menuId, function(data){
		// 	// @TODO test this "data" attribute
		// 	console.log(data);
		// });



		// GroceryModel.findById(groceryId)
		// .then(function(grocery){

		// 	DepartmentModel.find({
		// 		where:{
		// 			id: { inq:grocery.departments }
		// 		},
		// 		// fields: []       
		// 	},cb);

		// })
		// .catch(function(err){
		// 	if(err){ cb(err); }
		// });

	};

	Grocery.remoteMethod('groceryListForMenu', {
		accepts: {
		  arg: 'menuId',
		  type: 'string',
		  required: true
		},
		returns: {
		  arg: 'groceries',
		  type: 'array'
		},
		http: {
		  path: '/menu/:id',
  		  // path: '/:id/menu',
		  verb: 'get'
		}
	});

	// lets assume that we have both 
	//:todo you can extend this method if you want
	//:todo add remote method for this method
	Grocery.attachToUser = function(groceryId, userId, cb){

		var User = Grocery.app.models.user;
		
		User.findById(userId, {

		}, function(err, model){

			// console.log(model);
			var groceriesArray = [];

			if (typeof model.groceryIds !== 'undefined'){
				groceriesArray = model.groceryIds;
			}

			// console.log(groceriesArray);
			groceriesArray.unshift(groceryId);
			// console.log(groceriesArray);
			
			model.updateAttribute('groceryIds', groceriesArray);
			// console.log(model);
		});

	}


	// Grocery.remoteMethod('groceryListForMenu', {
	// 	accepts: {
	// 	  arg: 'menuId',
	// 	  type: 'string',
	// 	  required: true
	// 	},
	// 	returns: {
	// 	  arg: 'groceries',
	// 	  type: 'array'
	// 	},
	// 	http: {
	// 	  path: '/menu/:id',
 //  		  // path: '/:id/menu',
	// 	  verb: 'get'
	// 	}
	// });


	Grocery.groceryHideDepartment = function(departmentId, groceryId, cb){

		var Department = Grocery.app.models.Department;

		// we check if this department even exists
		Department.findById(departmentId, {}, function(){

			Grocery.findById(groceryId, {
				where: {departmentsList:inq(departmentId)}
			}).then(function(model){

				// console.log(model);
				var hiddenArray = model.hideThisIds;
				hiddenArray.push(departmentId)
				model.updateAttribute('hideThisIds', hiddenArray);
			})

		});

	};

	//:todo add remote method for enable API calls for this method


	Grocery.clone = function(groceryId, userId, cb){

		// Grocery.attachToUser(groceryId, userId);
		Grocery.findById(groceryId, {}, function(err, grocery){

			// console.log(grocery);
			//:todo use createnew method instead of duplicate stuff
			Grocery.create({
				title: 'Clone of <' + grocery.title + '>',
				desc: grocery.desc,
				slug: grocery.slug,
				img : grocery.img,
				departmentIds: grocery.departmentIds,
				hideThisIds:   grocery.hideThisIds,
			}, function(err, model){

				// console.log(model)
				// console.log( model.id );
				Grocery.attachToUser(model.id, userId, function(data){

				});

			});

			



		});
		

	}

	// 	data must have this structure:
	// {
	// 				title: data.title,
	// 				desc:  data.desc,
	// 				slug:  data.slug,
	// 				img :  data.img,
	// 				departmentIds: data.departmentIds,
	// 				hideThisIds:   data.hideThisIds,
	// 			}
	Grocery.createnew = function(userId, data, cb){

		Grocery.create(data, function(err, model){

				// console.log(model)
				// console.log( model.id );
				Grocery.attachToUser(model.id, userId, function(data){

				});

			});

	}

	Grocery.withDepartments = function(groceryId, cb){
		Grocery.findOne({
			include: {
				relation: 'departmentsList',
				scope: {
					fields: [ 'name' ],
					include: {
						relation: 'ingredients',
						scope: {
							fields: [ 'name' ],
							// where: {
							// 	departmentId: id
							// }
						}
					}

				}
			},
			where: {id:groceryId}

		}, cb);
	};

	//:todo think about adding count(to departments). 
	// So if ingredients in dep = 0 - don't show it
	Grocery.element = function(groceryId, cb){

		Grocery.withDepartments(groceryId, function(err, model){

			var g = grocery.toJSON();
			
			var departments = [];
			// console.log(g.desc);
			// console.log(g.departmentsList);

			// case #1 return only dep name with id for link creation
			g.departmentsList.forEach(function(item, i){

				if( item.visible ) {
					departments.push({
						 id: item.id,
						 name: item.name 
					});
				}	

				
			});
		})

	}

	Grocery.makePurchased = function(groceryId, ingredientId, cb){
		Grocery.findById(groceryId, {}, function(err, model){

			var purchasedArray = [];

			if (typeof model.purchasedIds !== 'undefined'){
				purchasedArray = model.purchasedIds;
			}

			// console.log(purchasedArray);
			purchasedArray.unshift(purchasedIds);
			// console.log(purchasedArray);
			
			model.updateAttribute('purchasedIds', purchasedArray);

		})
	};

	Grocery.makeUnpurchased = function(groceryId, ingredientId, cb){
		Grocery.findById(groceryId, {}, function(err, model){

	      var data = model.toJSON();
	      console.log(data.purchasedIds);

	      if( !data.purchasedIds ){ return true; } //:todo test this

	      let forDeletion = [ ingredientId ];

	      let arr = data.purchasedIds;

	      arr = arr.filter(item => !forDeletion.includes(item))
	      // !!! Read below about array.includes(...) support !!!

	      console.log(arr);

	      model.updateAttribute('purchasedIds', arr);
	      console.log(model);


			// var purchasedArray = [];

			// if (typeof model.purchasedIds !== 'undefined'){
			// 	purchasedArray = model.purchasedIds;
			// }

			// console.log(purchasedArray);
			// purchasedArray.unshift(purchasedIds);
			// console.log(purchasedArray);
			
			// model.updateAttribute('purchasedIds', purchasedArray);

		})
	};

	Grocery.withPurchased = function(groceryId, cb){
		Grocery.findOne({
			include: {
				relation: 'purchased',
				scope: {
					fields: [ 'id', 'name' ],
					// include: {
					// 	relation: 'ingredients',
					// 	scope: {
					// 		fields: [ 'name' ],
					// 		// where: {
					// 		// 	departmentId: id
					// 		// }
					// 	}
					// }

				}
			},
			where: { id:groceryId }

		}, cb);
	};


	Grocery.secondWave = function(groceryId, cb){

		var Department = Grocery.app.models.Department;

		Grocery.findById(groceryId, {

		}, function(err, grocery){

			console.log(grocery.ingredientIds);

			var ingArr = grocery.ingredientIds;

			Department.find({
				include: {
					relation: 'ingredients',
					scope: {
						where : {
							id: {
								inq: ingArr
							}
						}
					}
				}
			}, function(err, model){

				console.log(model);
				console.log(model.ingredientIds);
				var m = model.toJSON();
				console.log(m.ingredients);

			});

		});


	};
	
};
