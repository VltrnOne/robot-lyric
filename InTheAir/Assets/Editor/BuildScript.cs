using UnityEngine;
using UnityEditor;
using System.IO;

public class BuildScript
{
    [MenuItem("Build/Build WebGL")]
    public static void BuildWebGL()
    {
        string[] scenes = { "Assets/Scenes/Game.unity" };
        string buildPath = "../web-build";
        
        BuildPipeline.BuildPlayer(scenes, buildPath, BuildTarget.WebGL, BuildOptions.None);
        
        Debug.Log("WebGL build completed!");
    }
}
