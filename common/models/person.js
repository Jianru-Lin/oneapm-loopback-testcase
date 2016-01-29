var loopback = require( 'loopback' );
module.exports = function(Person) {
  Person.greet = function( userId, cb ) {
    var ctx = loopback.getCurrentContext();
    Person.findOne( { where : { _id : userId } },function(err, person ) {
      if( ctx ) {
        console.log( ctx.name );
      }
      if( !person ) {
        //return cb( new Error( 'user not found' ) );
        return cb( null, 'No person found' );
      }
      return cb( null, 'Greetings... ' + person.firstname + ' ' + person.lastname );
    } );
  }

  Person.remoteMethod( 'greet', {
    accepts : { arg: 'userId', type: 'number' },
    returns: { arg: 'greeting', type: 'string' }
  } );

};
