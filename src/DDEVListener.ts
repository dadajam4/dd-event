import DDEV from './DDEV';

/**
 * Any tag can be set for the listener. (Registration of objects as well as character strings is also possible)
 * By setting this tag when registering a listener with [[DDEV.on]] or [[DDEV.once]]
 * With [[DDEV.off]] you can release related listeners at once.
 */
export type DDEVListenerTag = number | string | Symbol | Object;
type DDEVStackRemover = (stack: DDEVListener) => void;

export default class DDEVListener {
  readonly context: DDEV;
  readonly type: string | null | undefined;
  readonly tag?: DDEVListenerTag;
  readonly handler: Function;
  readonly once: boolean;

  constructor({
    context,
    remover,
    type,
    tag,
    handler,
    once = false,
  }: {
    context: DDEV;
    remover: DDEVStackRemover;
    type: string;
    tag?: DDEVListenerTag;
    handler: Function;
    once: boolean;
  }) {
    this.context = context;
    this._remover = remover;
    this.type = type;
    this.tag = tag;
    this.handler = handler;
    this.once = once;
  }

  /**
   * Remove this instance from parent context.
   */
  remove() {
    this._remover(this);

    const self = this as any;

    self.context = null;
    self._remover = null;
    self.handler = null;
    self.tag = null;

    delete self.context;
    delete self._remover;
    delete self.handler;
    delete self.tag;
  }

  /**
   * Check match condition by type or handler or tag.
   * @param type
   * @param handler
   * @param tag
   */
  match(type?: string | null, handler?: Function, tag?: DDEVListenerTag) {
    if (handler && handler !== this.handler) return false;
    if (type && this.type !== type) {
      return false;
    }
    if (tag && this.tag !== tag) {
      return false;
    }
    return true;
  }

  /**
   * Trigger this listener.
   * @param params
   */
  trigger(params?: any) {
    this.handler(params, this);
    if (this.once) {
      this.remove();
    }
  }

  private _remover: DDEVStackRemover;
}
