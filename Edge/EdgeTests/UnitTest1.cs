using Edge;
using Edge.Entities;

namespace EdgeTests;

public class UnitTest1
{
    [Fact]
    public void ProcessMessageTest1()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 16000,
                X = 16000,
                Y = 16000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Good", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest2()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 16000,
                X = 10000,
                Y = 10000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Good", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest3()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 13000,
                X = 10000,
                Y = 10000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Ok", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest4()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 13000,
                X = 1,
                Y = 1,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Ok", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest5()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 11000,
                X = 10000,
                Y = 10000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Normal", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest6()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 11000,
                X = 1,
                Y = 1,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Normal", res.RoadState);
    }
        
    [Fact]
    public void ProcessMessageTest7()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 1000,
                X = 10000,
                Y = 10000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Bad", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest8()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 1000,
                X = 1,
                Y = 1,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Bad", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest9()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 40000,
                X = 10000,
                Y = 10000,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Baaad", res.RoadState);
    }
    
    [Fact]
    public void ProcessMessageTest10()
    {
        var testData = new AgentMessage()
        {
            Accelerometer = new Accelerometer()
            {
                Z = 40000,
                X = 1,
                Y = 1,
            }
        };
        
        var res = DataProcessor.ProcessMessage(testData);
        
        Assert.Equivalent("Baaad", res.RoadState);
    }
}