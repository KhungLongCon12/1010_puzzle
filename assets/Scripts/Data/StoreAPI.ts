import { _decorator, Component, director, find, Node, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StoreAPI")
export class StoreAPI extends Component {
  public gameClient;
  public matchId: string;
}
