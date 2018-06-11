import { IpcRenderer } from 'electron';
import { getResponseChannels, getRendererResponseChannels } from './util';

export interface BetterIpc {
  callMain(channel: string, data): Promise<{}>;
  answerMain(channel: string, callback: Function): void;
}

const ipc: IpcRenderer & BetterIpc = window.ipcRenderer as any;

ipc.callMain = (channel, data) => new Promise((resolve, reject) => {
  const {sendChannel, dataChannel, errorChannel} = getResponseChannels(channel);

  const cleanup = () => {
    ipc.removeAllListeners(dataChannel);
    ipc.removeAllListeners(errorChannel);
  };

  ipc.on(dataChannel, (event, result) => {
    cleanup();
    resolve(result);
  });

  ipc.on(errorChannel, (event, error) => {
    cleanup();
    reject(error);
  });

  ipc.send(sendChannel, data);
});

ipc.answerMain = (channel, callback) => {
  const browserWindow = window.getCurrentWindow();
  const {sendChannel, dataChannel, errorChannel} = getRendererResponseChannels(browserWindow.id, channel);

  ipc.on(sendChannel, async (event, data) => {
    try {
      ipc.send(dataChannel, await callback(data));
    } catch (err) {
      ipc.send(errorChannel, err);
    }
  });
};

export default ipc;
