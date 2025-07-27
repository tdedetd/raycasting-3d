export class Counters {
  private static readonly formatter = new Intl.NumberFormat('en-US', { compactDisplay: 'short' });
  private static counters: Record<string, number> = {};

  public static add(name: string): void {
    Counters.counters[name] = Counters.counters[name] ? Counters.counters[name] + 1 : 1;
  }

  public static log(): void {
    const formattedCounters = Object
      .entries(Counters.counters)
      .reduce<Record<string, string>>((acc, [name, count]) => {
        return {
          ...acc,
          [name]: Counters.formatter.format(count),
        };
      }, {});

    console.log(formattedCounters);
  }

  public static reset(): void {
    Counters.counters = {};
  }
}
