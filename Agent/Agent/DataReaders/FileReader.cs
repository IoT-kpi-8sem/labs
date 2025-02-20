using System.Globalization;
using Agent.Entities;

namespace Agent.DataReaders;

public class FileDataReader : IDataReader, IAsyncDisposable
{
    private FileStream _accFileStream;
    private StreamReader _accStream;
    
    private FileStream _gpsFileStream;
    private StreamReader _gpsStream;
    
    public void StartRead()
    {
        // _accFileStream = File.OpenRead("./accelerometer.csv");
        // _accStream = new StreamReader(_accFileStream);
        // _accStream.ReadLine();
        //
        // _gpsFileStream = File.OpenRead("./gps.csv");
        // _gpsStream = new StreamReader(_gpsFileStream);
        // _gpsStream.ReadLine();
        
        ReopenGpsFile();
        ReopenAccFile();
    }

    public void StopRead()
    {
        _accFileStream.Dispose();
        _gpsFileStream.Dispose();
    }

    public async IAsyncEnumerable<AgentMessage> Read()
    {
        int i = 0;
        float j = 0;
        while (true)
        {
            if (_accStream.EndOfStream)
                ReopenAccFile();
            
            if (_gpsStream.EndOfStream)
                ReopenGpsFile();
            
            var accStr = await _accStream.ReadLineAsync();
            var gpsStr = await _gpsStream.ReadLineAsync();
            
            var accCoords = accStr.Split(",");
            var gpsCoords = gpsStr.Split(",");
            
            i++;
            j += 0.1f;
            yield return new AgentMessage()
            {
                Accelerometer = new Accelerometer
                {
                    X = int.Parse(accCoords[0]),
                    Y = int.Parse(accCoords[1]),
                    Z = int.Parse(accCoords[2]),
                },
                Gps = new Gps
                {
                    Lng = float.Parse(gpsCoords[0], CultureInfo.InvariantCulture),
                    Lat = float.Parse(gpsCoords[1], CultureInfo.InvariantCulture),
                },
                ClientId = "test",
                Time = DateTime.Now,
            };
        }
    }

    private void ReopenAccFile()
    {
        _accFileStream?.Dispose();
        _accStream?.Dispose();
        _accFileStream = File.OpenRead("./accelerometer.csv");
        _accStream = new StreamReader(_accFileStream);
        _accStream.ReadLine();
    }
    
    private void ReopenGpsFile()
    {
        _gpsFileStream?.Dispose();
        _gpsStream?.Dispose();
        _gpsFileStream = File.OpenRead("./gps.csv");
        _gpsStream = new StreamReader(_gpsFileStream);
        _gpsStream.ReadLine();
    }

    public void Dispose()
    {
        _accFileStream.Dispose();
        _accStream.Dispose();
        _gpsFileStream.Dispose();
        _gpsStream.Dispose();
    }

    public async ValueTask DisposeAsync()
    {
        await _accFileStream.DisposeAsync();
        await CastAndDispose(_accStream);
        await _gpsFileStream.DisposeAsync();
        await CastAndDispose(_gpsStream);

        return;

        static async ValueTask CastAndDispose(IDisposable resource)
        {
            if (resource is IAsyncDisposable resourceAsyncDisposable)
                await resourceAsyncDisposable.DisposeAsync();
            else
                resource.Dispose();
        }
    }
}