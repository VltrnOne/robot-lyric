using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObstacleGenerator : MonoBehaviour
{
    [SerializeField]
    private float timeToGen = 3;
    private float counter;
    [SerializeField]
    private GameObject obstacles;
    private float randomizerAxeYObstacle;
    private void Start()
    {
        counter = timeToGen;
        randomizerAxeYObstacle = transform.position.y;
    }
    private void Update()
    {
        randomizerAxeYObstacle = Random.Range(0.5f, 2.7f);
        counter -= Time.deltaTime;
        if(counter < 0)
        {
            Vector2 position = new Vector2(transform.position.x, randomizerAxeYObstacle);
            GameObject.Instantiate(obstacles, position, Quaternion.identity);
            counter = timeToGen + Time.deltaTime;
        }
    }
}
