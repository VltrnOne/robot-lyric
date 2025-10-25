using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
public class UIController : MonoBehaviour
{
    public GameObject CanvasGameOver;
    public GameObject CanvasGame;
    public Text counterOnText;
    private void Start()
    {
        CanvasGameOver = GetComponent<GameObject>();
    }
    public void counterUpdate(int scores)
    {
        counterOnText.text = "" + scores;
    }
    public void GameOver()
    {
        CanvasGameOver.SetActive(true);
    }
    public void Restart()
    {
        SceneManager.LoadScene("Game");
        Time.timeScale = 1;
    }

}
