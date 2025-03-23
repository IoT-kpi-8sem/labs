using Agent.DataReaders;
using Agent.Entities;

namespace Tests;

public class UnitTest1
{
    [Fact]
    public void TestSpeedParser1()
    {
        var testSpeed = "123";

        var res = FileParser.ParseSpeed(testSpeed);
        
        Assert.Equivalent(123, res);
    }
    
    [Fact]
    public void TestSpeedParser2()
    {
        var testSpeed = "123.5";

        var res = FileParser.ParseSpeed(testSpeed);
        
        Assert.Equivalent(123.5f, res);
    }
    
    [Fact]
    public void TestGpsParser1()
    {
        var testGps = "123,222";

        var res = FileParser.ParseGps(testGps);
        
        Assert.Equivalent(new Gps()
        {
            Lat = 222,
            Lng = 123
        }, res);
    }
    
    [Fact]
    public void TestGpsParser2()
    {
        var testGps = "123.5,222.5";

        var res = FileParser.ParseGps(testGps);
        
        Assert.Equivalent(new Gps()
        {
            Lat = 222.5f,
            Lng = 123.5f
        }, res);
    }
    
    [Fact]
    public void TestAccParser1()
    {
        var testAcc = "111,222,333";

        var res = FileParser.ParseAcc(testAcc);
        
        Assert.Equivalent(new Accelerometer()
        {
            X = 111,
            Y = 222,
            Z = 333
        }, res);
    }
    
    [Fact]
    public void TestAccParser2()
    {
        var testAcc = "0,0,0";

        var res = FileParser.ParseAcc(testAcc);
        
        Assert.Equivalent(new Accelerometer()
        {
            X = 0,
            Y = 0,
            Z = 0
        }, res);
    }
}