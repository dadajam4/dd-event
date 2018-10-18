import DDEVListener from './DDEVListener';

export interface OnOption {
  tag?: string;
  immediate?: boolean;
}

export type DDEVStackRemover = (stack: DDEVListener) => void;

export interface DDEVEventMap {
  [key: string]: any;
}

export default class DDEV<EventMap extends DDEVEventMap = DDEVEventMap> {
  /**
   * Create and return new listener instance.
   * @param type
   * @param callback
   * @param option
   * @param once
   */
  on<K extends keyof EventMap>(
    type: K,
    callback: (ev: EventMap[K]) => any,
    optionOrTag: OnOption | string = {},
    once: boolean = false,
  ): DDEVListener {
    const option =
      typeof optionOrTag === 'string' ? { tag: optionOrTag } : optionOrTag;

    const listener = new DDEVListener({
      context: this,
      remover: listener => {
        this.__ev_listener_remover__(listener);
      },
      type: type as any,
      tag: option.tag,
      callback,
      once,
    });
    this.__ev_listeners__.push(listener);
    if (option && option.immediate) listener.trigger();

    return listener;
  }

  /**
   * Create and return new listener instance.
   * This listener is deleted when it detects an event only once.
   * @param type
   * @param callback
   * @param option
   */
  once<K extends keyof EventMap>(
    type: K,
    callback: (ev: EventMap[K]) => any,
    optionOrTag?: OnOption | string,
  ): DDEVListener {
    return this.on(type, callback, optionOrTag, true);
  }

  /**
   * Remove listener by `type` or `tag` or `callback`
   * @param type
   * @param tagOrCallback
   */
  off<K extends keyof EventMap>(
    type: K | null | undefined,
    tagOrCallback?: ((ev: EventMap[K]) => any) | string,
  ): void;

  /**
   * Remove listener by callback
   * @param callback
   */
  off<K extends keyof EventMap>(
    callback?: ((ev: EventMap[K]) => any) | string,
  ): void;

  /**
   * Remove listener by `type` or `tag` or `callback`
   * @param typeOrTagOrCallback
   * @param tagOrCallback
   */
  off<K extends keyof EventMap>(
    typeOrTagOrCallback: (
      ev: EventMap[K],
    ) => any | K | null | undefined | string,
    tagOrCallback?: (ev: EventMap[K]) => any | string,
  ): void {
    let type: K | null | undefined = undefined;
    let callback: Function | undefined = undefined;
    let tag: string | undefined | null = undefined;

    if (typeof typeOrTagOrCallback === 'function') {
      callback = typeOrTagOrCallback;
    } else {
      type = typeOrTagOrCallback;
      if (tagOrCallback) {
        if (typeof tagOrCallback === 'function') {
          callback = tagOrCallback;
        } else {
          tag = tagOrCallback;
        }
      }
    }
    const listeners = this.__ev_filter__(type as any, callback, tag);
    listeners.forEach(listener => {
      listener.remove();
    });
  }

  /**
   * Remove all listener instances.
   */
  offAll(): void {
    const listeners = this.__ev_listeners__.slice();
    listeners.forEach(listener => {
      listener.remove();
    });
  }

  /**
   * Emit event
   * @param type
   * @param payload
   */
  emit<K extends keyof EventMap>(type: K, payload?: EventMap[K]): void {
    const listeners = this.__ev_filter__(<string>type);
    listeners.forEach(listener => {
      listener.trigger(payload);
    });
  }

  private __ev_listeners__: DDEVListener[] = [];

  private __ev_listener_remover__(listener: DDEVListener) {
    this.__ev_listeners__.splice(this.__ev_listeners__.indexOf(listener), 1);
  }

  private __ev_filter__(
    type?: string | null,
    callback?: Function,
    tag?: string,
  ) {
    return this.__ev_listeners__.filter(listener =>
      listener.match(type, callback, tag),
    );
  }
}
