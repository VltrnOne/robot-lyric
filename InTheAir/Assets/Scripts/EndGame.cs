using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EndGame : MonoBehaviour
{
    private UIController myGameOver;
    private void Awake()
    {
        myGameOver = GetComponent<UIController>();
    }
    public void PauseScene()
    {
        myGameOver.GameOver();
        Time.timeScale = 0;
    }
}
