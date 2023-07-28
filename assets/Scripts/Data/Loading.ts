import GameClient from "@onechaintech/gamesdk-beta";
import { StoreAPI } from "./StoreAPI";
import { _decorator, Component, director, find, Node, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  public gameClient;

  @property({ type: ProgressBar })
  private progressBar: ProgressBar | null = null;

  private userId: string;

  public async start(): Promise<void> {
    let parameters = find("GameClient");
    let _this = this;

    if (parameters === null) {
      let parameters = new Node("GameClient");
      if (this.gameClient === undefined) {
        this.gameClient = new GameClient(
          "64ba576e31ded7cab4153dfe",
          "80c06804-1d9e-4ebc-83c8-13856a67ab92",
          window.parent,
          { dev: true }
        );
        await this.gameClient
          .initAsync()
          .then((data) => {
            _this.userId = this.gameClient.user.citizen.getSaId();
          })
          .catch((err) => console.log(err));
      }
      try {
        if (!localStorage.getItem("userId")) {
          localStorage.setItem("userId", this.userId);
        } else {
          if (localStorage.getItem("userId") !== this.userId) {
            localStorage.clear();
            localStorage.setItem("userId", this.userId);
          } else {
            localStorage.setItem("userId", this.userId);
          }
        }
      } finally {
        let gameClientParams = parameters.addComponent(StoreAPI);
        gameClientParams.gameClient = this.gameClient;
        director.addPersistRootNode(parameters);
      }
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
