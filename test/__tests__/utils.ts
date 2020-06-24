import 'jest';

export class TestClass {
  defaultAccessMutableProperty: unknown = '';
  defaultAccessOptionalProperty?: unknown = '';
  readonly defaultAccessReadonlyProperty: unknown = '';
  readonly defaultAccessOptionalReadonlyProperty?: unknown = '';

  public publicMutableProperty: unknown = '';
  public publicOptionalProperty?: unknown = '';
  public readonly publicReadonlyProperty: unknown = '';
  public readonly publicOptionalReadonlyProperty?: unknown = '';

  protected protectedMutableProperty: unknown = '';
  protected protectedOptionalProperty?: unknown = '';
  protected readonly protectedReadonlyProperty: unknown = '';
  protected readonly protectedOptionalReadonlyProperty?: unknown = '';

  private privateMutableProperty: unknown = '';
  private privateOptionalProperty?: unknown = '';
  private readonly privateReadonlyProperty: unknown = '';
  private readonly privateOptionalReadonlyProperty?: unknown = '';

  constructor(
    public publicMutableConstructorProperty: unknown,
    public readonly publicReadonlyConstructorProperty: unknown,

    protected protectedMutableConstructorProperty: unknown,
    protected readonly protectedReadonlyConstructorProperty: unknown,

    private privateMutableConstructorProperty: unknown,
    private readonly privateReadonlyConstructorProperty: unknown,

    public publicOptionalConstructorProperty?: unknown,
    protected protectedOptionalConstructorProperty?: unknown,
    private privateOptionalConstructorProperty?: unknown,
  ) {}

  defaultAccessMethod(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
  defaultAccessMethodWithInitializer = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  public publicMethod(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
  public publicMethodWithInitializer = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  private privateMethod(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
  private privateMethodWithInitializer = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  protected protectedMethod(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
  protected protectedMethodWithInitializer = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  get defaultAccessGetter(): unknown {
    return null;
  }

  public get publicGetter(): unknown {
    return null;
  }

  protected get protectedGetter(): unknown {
    return null;
  }

  private get privateGetter(): unknown {
    return null;
  }

  set defaultAccessSetter(value: unknown) {} // eslint-disable-line @typescript-eslint/no-empty-function

  public set publicSetter(value: unknown) {} // eslint-disable-line @typescript-eslint/no-empty-function

  protected set protectedSetter(value: unknown) {} // eslint-disable-line @typescript-eslint/no-empty-function

  private set privateSetter(value: unknown) {} // eslint-disable-line @typescript-eslint/no-empty-function
}

export interface TestInterface {
  property: string;
  method(): string;

  optionalProperty?: string;
  readonly readonlyProperty: string;
  readonly optionalReadonlyProperty?: string;
}

export const expectPropertiesMatch = (received: unknown[], expected: unknown[]): void => {
  expect(received).toHaveLength(expected.length);
  expect(new Set(received)).toEqual(new Set(expected));
};
