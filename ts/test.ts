namespace variotry
{
	"use strict";

	var $sc = $( "<script>" );
	$sc[0].onload = () =>
	{
		console.log( "ok2" );
	};
	$sc.attr( "src", "/js/test2.min.js" );
	$( "body" ).append( $sc );

	class Hoge
	{
		public constructor()
		{
			console.log( "hoge" );
		}
		public init(): void
		{
			var t2 = new Test2();
			return;
		}
	}
	let hoge = new Hoge();

	hoge.init();
}