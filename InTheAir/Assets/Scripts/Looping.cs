using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Looping : MonoBehaviour
{
    [SerializeField]
    private float velocity;
    private Vector2 positionImage;
    private float realImageSize;
    private float imageScale;
    private void Start()
    {
        positionImage = transform.position;
        realImageSize = GetComponent<SpriteRenderer>().size.x;
        imageScale = transform.localScale.x;
        
    }
    private void Update()
    {
        float distance = Mathf.Repeat(velocity * Time.timeSinceLevelLoad, realImageSize * imageScale);
        transform.position = positionImage + Vector2.left * distance;
    }
}
