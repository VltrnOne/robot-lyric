using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Plane : MonoBehaviour
{
    private Rigidbody2D plane;
    [SerializeField]
    private float impulseForceBelowPlane = 8;
    private EndGame endingGame;
    public int scoresCounter = 0;
    private UIController myUIController;
    public AudioClip AudioScore;

    private void Awake()
    {
        plane = GetComponent<Rigidbody2D>();
        endingGame = GetComponent<EndGame>();
        myUIController = GetComponent<UIController>();
    }
    private void Update()
    {
        if (Input.GetButtonDown("Fire1"))
        {
            planeImpulse();
        }
    }
    private void planeImpulse()
    {
        plane.velocity = Vector2.zero;
        plane.AddForce(Vector2.up * impulseForceBelowPlane, ForceMode2D.Impulse);   
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.CompareTag("Obstacles") || collision.CompareTag("Floor"))
        {
            endingGame.PauseScene();
        }
        else
        {
            scoresCounter++;
            myUIController.counterUpdate(scoresCounter);
            AudioController.Instance.PlayOneShot(AudioScore);
        }
    }
}
