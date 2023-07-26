import GameClient from "@onechaintech/gamesdk-dev";
import { StoreAPI } from "./StoreAPI";
import { _decorator, Component, director, find, Node, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  @property({ type: ProgressBar })
  private progressBar: ProgressBar | null = null;

  public gameClient;
  public async start(): Promise<void> {
    let parameters = find("GameClient");

    if (parameters === null) {
      let parameters = new Node("GameClient");
      if (this.gameClient === undefined) {
        this.gameClient = new GameClient(
          "64ba2cf2798ddd0f4a2d92b9",
          "eefdf7c8-a562-4780-9231-a86d0d613729",
          window.parent,
          { dev: true }
        );
        await this.gameClient
          .initAsync()
          .then(() => {})
          .catch((err) => console.log(err));
      }
      let gameClientParams = parameters.addComponent(StoreAPI);
      gameClientParams.gameClient = this.gameClient;
      director.addPersistRootNode(parameters);
    }
    director.loadScene("MainMenu");
  }

  update(dt) {
    var progress = this.progressBar.progress;
    if (progress > 0) {
      progress += dt;
    } else {
      progress = 1;
    }
    this.progressBar.progress = progress;
  }
}
