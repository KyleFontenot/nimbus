import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';

export default function fiveify(initial: unknown) {
  let value = initial;
  const internal = writable(initial);
  const unsubscribe = internal.subscribe((val) => {
    value = val;
  });
  onDestroy(() => {
    unsubscribe();
  });
  return [
    value,
    {
      set: internal.set,
      update: internal.update,
      subscribe: internal.update,
    },
  ];
};