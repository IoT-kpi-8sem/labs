using System.Globalization;
using Agent.Entities;

namespace Agent.DataReaders;

public static class FileParser
{
    public static Accelerometer ParseAcc(string acc)
    {
        var accCoords = acc.Split(",");
        return new Accelerometer
        {
            X = int.Parse(accCoords[0]),
            Y = int.Parse(accCoords[1]),
            Z = int.Parse(accCoords[2]),
        };
    }
    
    public static Gps ParseGps(string gps)
    {
        var gpsCoords = gps.Split(",");
        return new Gps
        {
            Lng = float.Parse(gpsCoords[0], CultureInfo.InvariantCulture),
            Lat = float.Parse(gpsCoords[1], CultureInfo.InvariantCulture),
        };
    }

    public static float ParseSpeed(string speed)
    {
        return float.Parse(speed, CultureInfo.InvariantCulture);
    }
}