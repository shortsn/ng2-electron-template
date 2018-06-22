import { unionize, ofType } from 'unionize';
import { ImageInfo, ContainerInfo } from 'dockerode';
import { DockerHealth } from './model';

export const DockerActions = unionize({

  FETCH_DOCKER_IMAGES: ofType(),
  FETCH_DOCKER_IMAGES_FAILED: ofType<Error>(),
  UPDATE_DOCKER_IMAGES: ofType<ImageInfo[]>(),


  DOCKER_REMOVE_IMAGE: ofType<ImageInfo>(),
  DOCKER_REMOVE_IMAGE_SUCCESS: ofType<ImageInfo>(),
  DOCKER_REMOVE_IMAGE_FAILED: ofType<Error>(),


  FETCH_DOCKER_CONTAINERS: ofType(),
  FETCH_DOCKER_CONTAINERS_FAILED: ofType<Error>(),
  UPDATE_DOCKER_CONTAINERS: ofType<ContainerInfo[]>(),

  DOCKER_START_HEALTHCHECK: ofType<number>(),
  DOCKER_STOP_HEALTHCHECK: ofType<{}>(),
  DOCKER_SET_HEALTH: ofType<DockerHealth>(),

}, 'type', 'payload');
