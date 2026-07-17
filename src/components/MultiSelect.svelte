<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import ClickOutside from './util/ClickOutside.svelte'
  import { fade } from 'svelte/transition'

  interface Props {
    style?: string | null
    clearbutton?: boolean
    possibleValues?: any[]
    selectedValues?: Writable<any[]>
    placeholder?: string
    disabled?: boolean
  }

  let {
    style = null,
    clearbutton = false,
    possibleValues = [],
    selectedValues = writable([]),
    placeholder = 'Select options...',
    disabled = false
  }: Props = $props()

  const value = writable('')
  const consideredOptions: Writable<any[]> = writable([])
  const showOptions: Writable<boolean> = writable(false)

  $effect(() => {
    if ($value === '') {
      showOptions.set(false)
    }
  })

  function setFilteredConsiderations(input: string) {
    const filter = possibleValues?.filter(each =>
      each.name?.toLowerCase().includes(input.toLowerCase())
        ? true
        : $selectedValues.find(d => d.name?.toLowerCase().includes(input.toLowerCase()))
          ? true
          : false
    )
    if (filter && filter.length === 0) {
      consideredOptions.set([])
    } else {
      consideredOptions.set(filter || [])
    }
  }

  function selectConsideration(considerationValue: { id: number; name: string; color?: string }) {
    selectedValues.update(prev => {
      const exists = prev.find(item => item.id === considerationValue.id)
      if (!exists) {
        prev.push(considerationValue)
      }
      return prev
    })
    setFilteredConsiderations($value)
    $value = ''
    showOptions.set(false)
  }

  function removeSelection(selected: any) {
    selectedValues.update(prev => prev.filter(item => item.id !== selected.id))
  }

  async function addNewTag(input: string) {
    const addnewtag = await fetch(`/api/tags`, {
      method: 'POST',
      body: JSON.stringify({
        name: input
      })
    }).then(data => data.json())
    console.log(addnewtag)
  }
</script>

<ClickOutside onclickoutside={() => showOptions.set(false)}>
  <div class="multiselect-wrapper">
    <div class="input-container">
      <input
        type="text"
        class="multiselect-input"
        {placeholder}
        {disabled}
        bind:value={$value}
        onfocus={() => {
          $showOptions = true
        }}
        oninput={e => {
          $showOptions = true
          value.set((e.target as HTMLInputElement).value)
          setFilteredConsiderations((e.target as HTMLInputElement).value)
        }}
        {style}
        role="combobox"
        aria-expanded={$showOptions}
        aria-controls="multiselect-options"
        aria-autocomplete="list"
        aria-multiselectable="true"
      />
      {#if clearbutton && $value}
        <button
          type="button"
          class="clear-button"
          aria-label="Clear search"
          onfocus={() => showOptions.set(true)}
          onclick={() => value.set('')}
        >
          ×
        </button>
      {/if}
    </div>

    {#if $showOptions && ($consideredOptions.length > 0 || $value !== '')}
      <div
        class="options-list"
        class:show={$showOptions}
        id="multiselect-options"
        role="listbox"
        aria-multiselectable="true"
      >
        <ul>
          {#if $value !== ''}
            <li
              class="option"
              role="option"
              tabindex="0"
              aria-selected="false"
              onclick={() => addNewTag($value)}
              onkeydown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  addNewTag($value)
                }
              }}
            >
              Add new tag: "{$value}"
            </li>
          {/if}
          {#each $consideredOptions as option}
            <li
              class="option"
              role="option"
              tabindex="0"
              aria-selected={$selectedValues.some(s => s.id === option.id)}
              onclick={() => selectConsideration(option)}
              onkeydown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  selectConsideration(option)
                }
              }}
            >
              {option.name}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if $selectedValues && $selectedValues.length > 0}
      <div class="selected-tags" role="list" aria-label="Selected items">
        {#each $selectedValues as selected (selected.id)}
          <div
            class="tag"
            role="listitem"
            transition:fade={{ duration: 300 }}
            style={selected?.color ? `--tag-color: ${selected.color};` : ''}
          >
            <span>{selected.name}</span>
            <button
              type="button"
              class="tag-remove"
              aria-label="Remove {selected.name}"
              onclick={() => removeSelection(selected)}
              onkeydown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  removeSelection(selected)
                }
              }}
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</ClickOutside>

<style>
  .multiselect-wrapper {
    display: block;
    width: 100%;
    position: relative;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .multiselect-input {
    width: 100%;
    padding: var(--size-3, 0.75rem);
    outline: 1px solid var(--primary-5, #418fca);
    border-radius: var(--radius-2, 4px);
    background: var(--white-0, #ffffff);
    display: inline-block;
    border: 1px solid transparent;
    margin-block: var(--size-2, 0.5rem);
    font-family: inherit;
    font-size: var(--font-size-1, 1rem);
    color: var(--black-0, #1a2d39);
    transition: outline-color var(--ease-3, 0.2s);
  }

  .multiselect-input:disabled {
    background-color: var(--white-2, #f5f5f5);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .multiselect-input:disabled::placeholder {
    color: var(--black-8, #bbb);
  }

  .multiselect-input::placeholder {
    color: var(--black-7, #aaa);
  }

  .multiselect-input:focus {
    outline-width: 2px;
    outline-color: var(--primary-4, #3a7cb3);
  }

  .clear-button {
    position: absolute;
    right: var(--size-3, 0.75rem);
    background-color: transparent;
    border: none;
    font-size: var(--font-size-3, 1.5rem);
    color: var(--black-5, #999);
    cursor: pointer;
    padding: 0;
    width: var(--size-5, 1.5rem);
    height: var(--size-5, 1.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--ease-3, 0.2s);
  }

  .clear-button:hover {
    color: var(--primary-5, #418fca);
  }

  .clear-button:focus {
    outline: 2px solid var(--primary-5, #418fca);
    outline-offset: 2px;
    border-radius: var(--radius-1, 2px);
  }

  .options-list {
    position: absolute;
    display: none;
    visibility: hidden;
    left: 0;
    top: 100%;
    border: 1px solid var(--primary-5, #418fca);
    width: 100%;
    background-color: var(--white-0, #ffffff);
    color: var(--black-0, #1a2d39);
    box-shadow: 0 var(--size-3, 0.75rem) var(--size-4, 1.25rem) calc(var(--size-2, 0.5rem) * -1)
      rgba(0, 0, 0, 0.53);
    border-radius: var(--radius-2, 4px);
    overflow: hidden;
    z-index: 100;
  }

  .options-list.show {
    display: block;
    visibility: visible;
  }

  .options-list ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .option {
    font-size: var(--font-size-1, 1.05rem);
    padding: var(--size-3, 0.75rem);
    margin: 0;
    border-bottom: 1px solid var(--primary-8, #d4e8f5);
    cursor: pointer;
    position: relative;
    transition: background-color var(--ease-3, 0.2s);
  }

  .option:last-of-type {
    border-bottom: none;
  }

  .option:hover,
  .option:focus {
    background-color: var(--primary-9, #e8f3f9);
    outline: none;
  }

  .option[aria-selected='true'] {
    background-color: var(--primary-8, #d4e8f5);
    font-weight: 600;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2, 0.5rem);
    margin-top: var(--size-2, 0.5rem);
  }

  .tag {
    background-color: var(--tag-color, var(--primary-7, #b3d9f0));
    display: inline-flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border-radius: var(--radius-pill, 100vw);
    border: 1px solid transparent;
    position: relative;
    box-shadow: 0 var(--size-1, 0.25rem) var(--size-3, 0.75rem) 0 rgba(0, 0, 0, 0.1);
  }

  .tag span {
    font-weight: 500;
    font-size: var(--font-size-1, 1.05rem);
    color: var(--black-0, #1a2d39);
  }

  .tag-remove {
    background: transparent;
    border: none;
    font-size: var(--font-size-2, 1.25rem);
    color: var(--black-2, #555);
    cursor: pointer;
    padding: 0;
    width: var(--size-4, 1.125rem);
    height: var(--size-4, 1.125rem);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--ease-3, 0.2s);
    line-height: 1;
  }

  .tag-remove:hover {
    color: var(--secondary-5, #f76060);
  }

  .tag-remove:focus {
    outline: 2px solid var(--primary-5, #418fca);
    outline-offset: 2px;
    border-radius: var(--radius-round, 50%);
  }
</style>
