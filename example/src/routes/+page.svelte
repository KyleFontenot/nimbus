<script lang="ts">
  import Button from '../../../src/components/Button.svelte'
  import Input from '../../../src/components/Input.svelte'
  import Card from '../../../src/components/Card.svelte'
  import DateInput from '../../../src/components/DateInput.svelte'
  import Select from '../../../src/components/Select.svelte'
  import Toggle from '../../../src/components/Toggle.svelte'
  import Radio from '../../../src/components/Radio.svelte'
  import Range from '../../../src/components/Range.svelte'
  import Badge from '../../../src/components/Badge.svelte'
  import Alert from '../../../src/components/Alert.svelte'
  import Details from '../../../src/components/Details.svelte'
  import Dialog from '../../../src/components/Dialog.svelte'
  import Tabs from '../../../src/components/Tabs.svelte'
  import Progress from '../../../src/components/Progress.svelte'
  import Spinner from '../../../src/components/Spinner.svelte'
  import Skeleton from '../../../src/components/Skeleton.svelte'
  import Divider from '../../../src/components/Divider.svelte'
  import Avatar from '../../../src/components/Avatar.svelte'
  import Tooltip from '../../../src/components/Tooltip.svelte'
  import InputStringArray from '../../../src/components/InputStringArray.svelte'
  import Breadcrumb from '../../../src/components/Breadcrumb.svelte'
  import Pagination from '../../../src/components/Pagination.svelte'
  import Toast, { showToast } from '../../../src/components/Toast.svelte'
  import FormField from '../../../src/clumps/FormField.svelte'
  import StatCard from '../../../src/clumps/StatCard.svelte'
  import EmptyState from '../../../src/clumps/EmptyState.svelte'
  import UserBlock from '../../../src/clumps/UserBlock.svelte'
  import DashboardGrid from '../../../src/layouts/DashboardGrid.svelte'

  let dialogOpen = $state(false)
  let rangeVal = $state(50)
  let toggleChecked = $state(false)
  let page = $state(1)
  let tags: string[] = $state(['svelte', 'nimbus'])
</script>

<main>
  <h1>Nimbus Component Library</h1>

  <section>
    <h2>Buttons</h2>
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button outlined>Outlined</Button>
    <Button minimal>Minimal</Button>
    <Button disabled>Disabled</Button>
  </section>

  <Divider />

  <section>
    <h2>Form Inputs</h2>
    <FormField label="Text input" for="text1" helpText="Just a standard text field">
      <Input id="text1" placeholder="Type something..." />
    </FormField>
    <FormField label="Date" for="date1">
      <DateInput id="date1" name="date" />
    </FormField>
    <FormField label="Select" for="sel1">
      <Select
        id="sel1"
        name="category"
        blankDefault
        options={[
          { value: 'a', text: 'Option A' },
          { value: 'b', text: 'Option B' },
          { value: 'c', text: 'Option C' },
        ]}
      />
    </FormField>
    <FormField label="Tags" for="tags1">
      <InputStringArray bind:value={tags} name="tags" placeholder="Add a tag..." />
    </FormField>
    <Toggle bind:checked={toggleChecked} label="Toggle me" name="toggle1" />
    <Radio
      name="choice"
      direction="row"
      options={[
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ]}
    />
    <Range bind:value={rangeVal} label="Volume" showValue min={0} max={100} />
  </section>

  <Divider />

  <section>
    <h2>Feedback</h2>
    <Alert variant="info">This is an info alert.</Alert>
    <Alert variant="success" dismissible>Success! This can be dismissed.</Alert>
    <Alert variant="error">Something went wrong.</Alert>

    <Button onclick={() => showToast('File saved successfully', { type: 'success' })}>
      Show Toast
    </Button>
    <Toast />

    <Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
    <Dialog bind:open={dialogOpen} label="Example dialog">
      <h3>Dialog Title</h3>
      <p>This is dialog content.</p>
    </Dialog>

    <h3>Progress</h3>
    <Progress value={65} max={100} label="Upload" size="medium" />
    <Progress label="Indeterminate" size="small" />

    <h3>Loading States</h3>
    <div style="display: flex; gap: 1rem; align-items: center;">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>

    <h3>Skeleton</h3>
    <Skeleton lines={3} />
    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
      <Skeleton circle height="3rem" />
      <div style="flex:1;"><Skeleton lines={2} /></div>
    </div>
  </section>

  <Divider />

  <section>
    <h2>Display</h2>

    <h3>Badges</h3>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info" pill>Info Pill</Badge>
    </div>

    <h3>Cards</h3>
    <Card>A basic card with some content inside.</Card>
    <Card status="success">Success card</Card>

    <h3>Accordion</h3>
    <Details summary="Click to expand">
      <p>Hidden content revealed on click.</p>
    </Details>

    <h3>Tabs</h3>
    <Tabs
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'details', label: 'Details' },
        { id: 'settings', label: 'Settings' },
      ]}
    >
      {#snippet children(activeId)}
        {#if activeId === 'overview'}
          <p>Overview content</p>
        {:else if activeId === 'details'}
          <p>Details content</p>
        {:else}
          <p>Settings content</p>
        {/if}
      {/snippet}
    </Tabs>

    <h3>Tooltip</h3>
    <Tooltip text="I'm a tooltip!" position="top">
      <Button>Hover me</Button>
    </Tooltip>

    <h3>Avatar</h3>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <Avatar initials="KF" size="small" />
      <Avatar initials="NB" size="medium" />
      <Avatar initials="XL" size="large" />
    </div>
  </section>

  <Divider />

  <section>
    <h2>Navigation</h2>
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Breadcrumb' },
      ]}
    />
    <Pagination bind:page total={120} perPage={10} />
  </section>

  <Divider />

  <section>
    <h2>Clumps</h2>

    <h3>User Block</h3>
    <UserBlock name="Kyle Fontenot" subtitle="Developer" initials="KF" />

    <h3>Stat Cards</h3>
    <DashboardGrid minItemWidth="14rem">
      <StatCard label="Revenue" value="$12,400" trend="up" trendValue="+12%" />
      <StatCard label="Users" value="1,024" trend="down" trendValue="-3%" />
      <StatCard label="Uptime" value="99.9%" trend="neutral" trendValue="0%" />
    </DashboardGrid>

    <h3>Empty State</h3>
    <EmptyState title="No results found" description="Try adjusting your search or filters.">
      <Button>Clear filters</Button>
    </EmptyState>
  </section>
</main>

<style>
  main {
    max-width: 50rem;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  section {
    margin-bottom: 2rem;
  }
  h2 {
    margin-bottom: 1rem;
  }
  h3 {
    margin: 1rem 0 0.5rem;
  }
</style>
