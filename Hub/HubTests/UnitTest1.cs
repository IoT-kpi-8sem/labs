using Edge.Entities;
using Hub.Services;
using Moq;

namespace HubTests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        var saveCount = 0;
        var semaphore = new Semaphore(initialCount: 0, maximumCount: 1);
        var mock = new Mock<IStoreAdapter>();
        mock.Setup(s => s.Save(It.IsAny<IEnumerable<ProcessedAgentData>>()))
            .Callback<IEnumerable<ProcessedAgentData>>(i =>
            {
                saveCount++;
                semaphore.Release();
            })
            .Returns(Task.CompletedTask);
        
        var service = new StoreService(mock.Object);
        for (int i = 0; i < 10; i++)
        {
            service.SaveData(new ProcessedAgentData());
        }

        semaphore.WaitOne();
        Assert.Equal(1, saveCount);
    }
    
    [Fact]
    public void Test2()
    {
        var saveCount = 0;
        var mock = new Mock<IStoreAdapter>();
        mock.Setup(s => s.Save(It.IsAny<IEnumerable<ProcessedAgentData>>()))
            .Callback<IEnumerable<ProcessedAgentData>>(i =>
            {
                saveCount++;
            })
            .Returns(Task.CompletedTask);
        
        var service = new StoreService(mock.Object);
        for (int i = 0; i < 2; i++)
        {
            service.SaveData(new ProcessedAgentData());
        }

        Assert.Equal(0, saveCount);
    }
    
    [Fact]
    public void Test3()
    {
        var saveCount = 0;
        var barrier = new Barrier(3);
        var mock = new Mock<IStoreAdapter>();
        mock.Setup(s => s.Save(It.IsAny<IEnumerable<ProcessedAgentData>>()))
            .Callback<IEnumerable<ProcessedAgentData>>(i =>
            {
                Interlocked.Increment(ref saveCount);
                Task.Run(() => barrier.SignalAndWait());
            })
            .Returns(Task.CompletedTask);
        
        var service = new StoreService(mock.Object);
        for (int i = 0; i < 20; i++)
        {
            service.SaveData(new ProcessedAgentData());
        }

        barrier.SignalAndWait();
        Assert.Equal(2, saveCount);
    }
    
    [Fact]
    public void Test4()
    {
        var saveCount = 0;
        var barrier = new Barrier(21);
        var mock = new Mock<IStoreAdapter>();
        mock.Setup(s => s.Save(It.IsAny<IEnumerable<ProcessedAgentData>>()))
            .Callback<IEnumerable<ProcessedAgentData>>(i =>
            {
                Interlocked.Increment(ref saveCount);
                Task.Run(() => barrier.SignalAndWait());
            })
            .Returns(Task.CompletedTask);
        
        var service = new StoreService(mock.Object);
        for (int i = 0; i < 200; i++)
        {
            service.SaveData(new ProcessedAgentData());
        }

        barrier.SignalAndWait();
        Assert.Equal(20, saveCount);
    }
}