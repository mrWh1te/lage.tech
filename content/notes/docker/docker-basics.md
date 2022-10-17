# Docker

Containerization for the cloud, or your personal computer.

## Detached Mode

You can run the containers in the background, which is probably cleaner for the typical end User. When running the command to lift the stack, add the `-d` detached mode flag:

```bash
$ docker-compose up -d
```

### Lookup Detached Containers

Look up active containers with the `ps` command:

```bash
$ docker ps
```

### Attach Detached Container

To see a live feed of the container's log, using a container ID ie:

```bash
$ docker attach 7b3e96546fe7
```

### Stop Detached Container

Turn off individual containers, gracefully, by copying/pasting their Container ID into this command, for example:

```bash
$ docker stop 7b3e96546fe7
```

### View Detached Container Log

Shows a container's command’s `STDOUT` and `STDERR` (print outs including errors ie NodeJS console log messages).

```bash
$ docker logs 7b3e96546fe7
```

### Attach to Container

```bash
$ docker attach 7b3e96546fe7
```

## Troubleshooting

### Host already being used

It's possible to leak containers after closing the terminal, maybe due to a separate glitch in the system, but if that happens, you can look up the containers running in the background with this command:

```bash
$ docker ps

CONTAINER ID   IMAGE             COMMAND                  CREATED       STATUS          PORTS                                                                                            NAMES
7b3e96546fe7   project_container   "docker-entrypoint.s…"   11 days ago   Up 10 seconds   0.0.0.0:4200->4200/tcp, :::4200->4200/tcp                                                        project_container_1
738c844f9922   project_container2   "docker-entrypoint.s…"   11 days ago   Up 8 seconds    0.0.0.0:8080->8080/tcp, :::8080->8080/tcp                                                        project_container2_1
71d7830cc617   project_container3      "docker-entrypoint.s…"   12 days ago   Up 9 seconds    0.0.0.0:1337->1337/tcp, :::1337->1337/tcp                                                        project_container3_1
58e9ee55fd32   neo4j:4.4         "tini -g -- /startup…"   2 weeks ago   Up 9 seconds    0.0.0.0:7474->7474/tcp, :::7474->7474/tcp, 7473/tcp, 0.0.0.0:7687->7687/tcp, :::7687->7687/tcp   voyager_neo4j_1

```

It will list every container running. Then turn off each with the `kill` command by refering the container ID for each:

```bash
$ docker kill 7b3e96546fe7
```
