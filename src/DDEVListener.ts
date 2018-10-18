import DDEV, { DDEVStackRemover } from './DDEV';

export default class DDEVListener {
  readonly context: DDEV;
  readonly type: string | null | undefined;
  readonly tag?: string;
  readonly callback: Function;
  readonly once: boolean;

  constructor({
    context,
    remover,
    type,
    tag,
    callback,
    once = false,
  }: {
    context: DDEV;
    remover: DDEVStackRemover;
    type: string;
    tag?: string;
    callback: Function;
    once: boolean;
  }) {
    this.context = context;
    this._remover = remover;
    this.type = type;
    this.tag = tag;
    this.callback = callback;
    this.once = once;
  }

  /**
   * Remove this instance from parent context
   */
  remove() {
    this._remover(this);

    const self = this as any;

    self.context = null;
    self._remover = null;
    self.callback = null;

    delete self.context;
    delete self._remover;
    delete self.callback;
  }

  /**
   * Check match condition by type or callback or tag
   * @param type
   * @param callback
   * @param tag
   */
  match(type?: string | null, callback?: Function, tag?: string) {
    if (callback && callback !== this.callback) return false;
    if (type && this.type !== type) {
      return false;
    }
    if (tag && this.tag !== tag) {
      return false;
    }
    return true;
  }

  /**
   * Trigger this listener
   * @param params
   */
  trigger(params?: any) {
    this.callback(params, this);
    if (this.once) {
      this.remove();
    }
  }

  private _remover: DDEVStackRemover;
}
