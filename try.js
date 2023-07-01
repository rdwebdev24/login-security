function test() 
{
	try 
	{
		console.log("Inside try block");
		return 10;
	} 
	finally
	{
		console.log("finally");
		//return 1;
   	}
}

console.log( test() );
