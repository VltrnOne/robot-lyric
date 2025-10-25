using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Obstacles : MonoBehaviour
{
    [SerializeField]
    private float velocity;
    [SerializeField]
    private float timeDestroyObjects = 7;
    private void Start()
    {
        StartCoroutine(timeDestroyObstacles());
    }
    private void Update()
    {
        transform.Translate(Vector2.left*velocity*Time.deltaTime);
    }
    private IEnumerator timeDestroyObstacles()
    {
        yield return new WaitForSeconds(timeDestroyObjects);
        Destroy(gameObject);
    }
}
