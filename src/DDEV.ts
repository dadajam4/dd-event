import DDEVListener, { DDEVListenerTag } from './DDEVListener';

/**
 * This is the default event map.
 */
export interface DDEVEventMap {
  [key: string]: any;
}

/**
 * By setting it to true, callback is immediately executed at the same time as listener registration.
 */
export type ImmediateOption = boolean;

/**
 * The context class for event operations.<br>
 * You can use as it is or inherit any classes in this class.<br>
 * <pre><code>const dv = new DDEV();
 * // or...
 * class SomeClass extends DDEV {}
 * </code></pre>
 * When using it with TypeScript, it is possible to strictly set type information by specifying an interface in Generics.<br>
 * <pre><code>class SomeClass extends DDEV<{event1: string, event2: boolean}> {
 *   constructor() {
 *     super();
 *     this.emit('event1', 5); // ng
 *     this.emit('event1', 'string'); // ok
 *     this.on('event2', event => {
 *       const var1: string = event; // ng
 *       const var2: boolean = event; // ok
 *     });
 *   }
 * }</code></pre>
 */
export default class DDEV<EventMap extends DDEVEventMap = DDEVEventMap> {
  /**
   * Create and return listener instance by type, handler.
   * @param type
   * @param handler
   */
  on<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
  ): DDEVListener;

  /**
   * Create and return listener instance by type, handler, option.
   * @param type
   * @param handler
   * @param option
   */
  on<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
    option: {
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
      once?: boolean;
    },
  ): DDEVListener;

  /**
   * Create and return listener instance by type, handler, once.
   * @param type
   * @param handler
   * @param option
   * @param once
   */
  on<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
    option: {
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
    },
    once?: boolean,
  ): DDEVListener;

  /**
   * Create and return listener instance by type, option.
   * @param type
   * @param option
   */
  on<K extends keyof EventMap>(
    type: K,
    option: {
      handler: ((ev: EventMap[K]) => any);
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
      once?: boolean;
    },
  ): DDEVListener;

  /**
   * Create and return listener instance by option.
   * @param option
   */
  on<K extends keyof EventMap>(option: {
    type: K;
    handler: (ev: EventMap[K]) => any;
    tag?: DDEVListenerTag;
    immediate?: ImmediateOption;
    once?: boolean;
  }): DDEVListener;

  on<K extends keyof EventMap>(
    typeOrOption:
      | K
      | {
          type: K;
          handler: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
          immediate?: ImmediateOption;
          once?: boolean;
        },
    handlerOrOption?:
      | ((ev: EventMap[K]) => any)
      | {
          handler: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
          immediate?: ImmediateOption;
          once?: boolean;
        },
    option?: {
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
      once?: boolean;
    },
    once?: boolean,
  ): DDEVListener {
    let _type: K;
    let _handler: (ev: EventMap[K]) => any;
    let _tag: DDEVListenerTag | undefined = undefined;
    let _immediate: boolean = false;
    let _once: boolean = false;
    if (typeof typeOrOption === 'object') {
      _type = typeOrOption.type;
      _handler = typeOrOption.handler;
      _tag = typeOrOption.tag;
      _immediate = !!typeOrOption.immediate;
      _once = !!typeOrOption.once;
    } else {
      _type = typeOrOption;
      if (typeof handlerOrOption === 'object') {
        _handler = handlerOrOption.handler;
        _tag = handlerOrOption.tag;
        _immediate = !!handlerOrOption.immediate;
        _once = !!handlerOrOption.once;
      } else {
        _handler = <any>handlerOrOption;
        if (option) {
          _tag = option.tag;
          _immediate = !!option.immediate;
          _once = !!option.once;
        }
      }
    }

    const listener = new DDEVListener({
      context: this,
      remover: listener => {
        this.__ev_listener_remover__(listener);
      },
      type: _type as any,
      tag: _tag,
      handler: _handler,
      once: once || _once,
    });

    this.__ev_listeners__.push(listener);
    if (_immediate) listener.trigger();
    return listener;
  }

  /**
   * Create and return listener instance by type, handler.
   * This listener is deleted when it detects an event only once.
   * @param type
   * @param handler
   */
  once<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
  ): DDEVListener;

  /**
   * Create and return listener instance by type, handler, option.
   * This listener is deleted when it detects an event only once.
   * @param type
   * @param handler
   * @param option
   */
  once<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
    option: {
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
    },
  ): DDEVListener;

  /**
   * Create and return listener instance by type, option.
   * This listener is deleted when it detects an event only once.
   * @param type
   * @param option
   */
  once<K extends keyof EventMap>(
    type: K,
    option: {
      handler: ((ev: EventMap[K]) => any);
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
    },
  ): DDEVListener;

  /**
   * Create and return listener instance by option.
   * This listener is deleted when it detects an event only once.
   * @param option
   */
  once<K extends keyof EventMap>(option: {
    type: K;
    handler: (ev: EventMap[K]) => any;
    tag?: DDEVListenerTag;
    immediate?: ImmediateOption;
  }): DDEVListener;

  once<K extends keyof EventMap>(
    typeOrOption:
      | K
      | {
          type: K;
          handler: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
          immediate?: ImmediateOption;
        },
    handlerOrOption?:
      | ((ev: EventMap[K]) => any)
      | {
          handler: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
          immediate?: ImmediateOption;
        },
    option?: {
      tag?: DDEVListenerTag;
      immediate?: ImmediateOption;
    },
  ): DDEVListener {
    return this.on(<any>typeOrOption, <any>handlerOrOption, <any>option, true);
  }

  /**
   * Remove listener by type
   * @param type
   */
  off<K extends keyof EventMap>(type: K): void;

  /**
   * Remove listener by type and handler.
   * @param type
   * @param handler
   */
  off<K extends keyof EventMap>(
    type: K,
    handler: (ev: EventMap[K]) => any,
  ): void;

  /**
   * Remove listener by type and option.
   * @param type
   * @param option
   */
  off<K extends keyof EventMap>(
    type: K,
    option: {
      handler?: (ev: EventMap[K]) => any;
      tag?: DDEVListenerTag;
    },
  ): void;

  /**
   * Remove listener by handler.
   * @param handler
   */
  off<K extends keyof EventMap>(handler: (ev: EventMap[K]) => any): void;

  /**
   * Remove listener by option(tag, handler, tag).
   * @param option
   */
  off<K extends keyof EventMap>(option: {
    type?: K;
    handler?: (ev: EventMap[K]) => any;
    tag?: DDEVListenerTag;
  }): void;

  off<K extends keyof EventMap>(
    typeOrHandlerOrOption:
      | K
      | ((ev: EventMap[K]) => any)
      | {
          type?: K;
          handler?: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
        },
    handlerOrOption?:
      | ((ev: EventMap[K]) => any)
      | {
          handler?: (ev: EventMap[K]) => any;
          tag?: DDEVListenerTag;
        },
  ): void {
    let _type: K | undefined = undefined;
    let _handler: ((ev: EventMap[K]) => any) | undefined;
    let _tag: DDEVListenerTag | undefined = undefined;

    if (typeof typeOrHandlerOrOption === 'object') {
      _type = typeOrHandlerOrOption.type;
      _handler = typeOrHandlerOrOption.handler;
      _tag = typeOrHandlerOrOption.tag;
    } else if (typeof typeOrHandlerOrOption === 'function') {
      _handler = typeOrHandlerOrOption;
    } else {
      _type = typeOrHandlerOrOption;
      if (typeof handlerOrOption === 'object') {
        _handler = handlerOrOption.handler;
        _tag = handlerOrOption.tag;
      } else {
        _handler = handlerOrOption;
      }
    }
    const listeners = this.__ev_filter__(_type as any, _handler, _tag);
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
   * Emit event.
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
    handler?: Function,
    tag?: DDEVListenerTag,
  ) {
    return this.__ev_listeners__.filter(listener =>
      listener.match(type, handler, tag),
    );
  }
}
