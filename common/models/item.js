var loopback = require( 'loopback' );

module.exports = function(Item) {
  Item.on('dataSourceAttached', function(obj){
    var create  = Item.create;
    Item.create = function(data, options, cb) {
      console.log(loopback.getCurrentContext());
      create.apply(Item, [data, options, cb]);
    };
  });
};
