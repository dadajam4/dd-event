import 'jest';
import DDEV from '../src/DDEV';
import DDEVListener from '../src/DDEVListener';

function getListeners(ev: DDEV): DDEVListener[] {
  return (ev as any).__ev_listeners__;
}

describe('constract', () => {
  it('should can constract', () => {
    const ev = new DDEV();
    if (!(ev instanceof DDEV)) {
      throw new Error('Initialization failed.');
    }
  });

  it('should can extend', () => {
    class TestClass extends DDEV {
      constructor() {
        super();
      }
    }
    const DDEVKeys = Object.keys(DDEV.prototype);
    for (const key of DDEVKeys) {
      expect((TestClass as any).prototype[key]).toStrictEqual(
        (DDEV as any).prototype[key],
      );
    }
  });
});

describe('on', () => {
  it('should can on', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listener = ev.on('test', () => {});
    expect(listeners.length).toStrictEqual(1);
    expect(listeners[0]).toStrictEqual(listener);
  });

  it('should can multiple on', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listenr1 = ev.on('test', () => {});
    const listenr2 = ev.on('test', () => {}, { immediate: true });
    const listenr3 = ev.on('test3', () => {});
    const listenr4 = ev.on('test4', () => {}, { tag: 'fuga' });
    expect(listeners.length).toStrictEqual(4);
    expect(listeners[0]).toStrictEqual(listenr1);
    expect(listeners[1]).toStrictEqual(listenr2);
    expect(listeners[2]).toStrictEqual(listenr3);
    expect(listeners[3]).toStrictEqual(listenr4);
    expect(listenr1.type).toStrictEqual('test');
    expect(listenr4.type).toStrictEqual('test4');
    expect(listenr4.tag).toStrictEqual('fuga');
  });

  it('should can emit', () => {
    expect.assertions(1);
    const ev = new DDEV();
    ev.on('test', payload => {
      expect(payload).toStrictEqual(true);
    });
    ev.emit('test', true);
  });

  it('should can recieve correctly payload', () => {
    expect.assertions(5);

    const ev = new DDEV<{
      e1: number;
      e2: string;
      e3: boolean;
    }>();

    ev.on('e1', p => expect(p).toStrictEqual(1));
    ev.on('e1', p => expect(p).toStrictEqual(1), { tag: 'tag1' });
    ev.on('e2', p => expect(p).toStrictEqual('str'));
    ev.on('e3', p => expect(p).toStrictEqual(true));
    ev.on('e3', p => expect(p).toStrictEqual(true), 'tag2');

    ev.emit('e1', 1);
    ev.emit('e2', 'str');
    ev.emit('e3', true);
  });
});

describe('once', () => {
  it('should can once', done => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listener = ev.once('test', () => {
      setTimeout(() => {
        expect(listeners.length).toStrictEqual(0);
        expect(listener.context).toBeUndefined();
        expect((listener as any)._remover).toBeUndefined();
        expect(listener.callback).toBeUndefined();
        done();
      }, 0);
    });
    expect(listeners.length).toStrictEqual(1);
    ev.emit('test');
  });
});

describe('off', () => {
  it('should can off by type', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listener = ev.on('test1', () => {});
    ev.on('test2', () => {});
    ev.on('test3', () => {}, 'tag1');

    expect(listeners.length).toStrictEqual(3);
    ev.off('test4');
    expect(listeners.length).toStrictEqual(3);
    ev.off('test1');
    expect(listener.context).toBeUndefined();
    expect((listener as any)._remover).toBeUndefined();
    expect(listener.callback).toBeUndefined();
    expect(listeners.length).toStrictEqual(2);
    ev.off('test3');
    expect(listeners.length).toStrictEqual(1);
    ev.off('test2');
    expect(listeners.length).toStrictEqual(0);
  });

  it('should can off by callback', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const cb1 = () => {};
    const cb2 = () => {};
    const cb3 = () => {};
    const listener = ev.on('test1', cb1);
    ev.on('test2', cb2);
    ev.on('test3', cb3, 'tag1');
    ev.off(() => {});
    expect(listeners.length).toStrictEqual(3);
    ev.off('test1', () => {});
    expect(listeners.length).toStrictEqual(3);
    ev.off('test1', cb1);
    expect(listeners.length).toStrictEqual(2);
    expect(listener.context).toBeUndefined();
    expect((listener as any)._remover).toBeUndefined();
    expect(listener.callback).toBeUndefined();
    ev.off(cb2);
    expect(listeners.length).toStrictEqual(1);
    ev.off(cb2);
    expect(listeners.length).toStrictEqual(1);
    ev.off(cb3);
    expect(listeners.length).toStrictEqual(0);
  });

  it('should can off by tag', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listener = ev.on('test1', () => {}, { tag: 'tag1' });
    ev.on('test2', () => {}, 'tag1');
    ev.on('test2', () => {});
    ev.on('test3', () => {}, 'tag2');
    ev.on('test4', () => {}, 'tag2');
    ev.on('test5', () => {}, { tag: 'tag2' });

    expect(listeners.length).toStrictEqual(6);
    ev.off(undefined, 'tag9');
    expect(listeners.length).toStrictEqual(6);
    ev.off('test3', 'tag1');
    expect(listeners.length).toStrictEqual(6);
    ev.off(undefined, 'tag1');
    expect(listeners.length).toStrictEqual(4);
    expect(listener.context).toBeUndefined();
    expect((listener as any)._remover).toBeUndefined();
    expect(listener.callback).toBeUndefined();
    ev.off('test3', 'tag2');
    expect(listeners.length).toStrictEqual(3);
    ev.off(null, 'tag2');
    expect(listeners.length).toStrictEqual(1);
    ev.off('test2');
    expect(listeners.length).toStrictEqual(0);
  });
});

describe('offAll', () => {
  it('should can off All', () => {
    const ev = new DDEV();
    const listeners = getListeners(ev);
    const listener = ev.on('test1', () => {}, { tag: 'tag1' }); // ★
    ev.on('test2', () => {}, 'tag1');
    ev.on('test2', () => {});
    ev.on('test3', () => {}, 'tag2'); // ★
    ev.on('test4', () => {}, 'tag2');
    ev.on('test5', () => {}, { tag: 'tag2' }); // ★

    expect(listeners.length).toStrictEqual(6);
    ev.offAll();
    expect(listeners.length).toStrictEqual(0);
    expect(listener.context).toBeUndefined();
    expect((listener as any)._remover).toBeUndefined();
    expect(listener.callback).toBeUndefined();
  });
});
