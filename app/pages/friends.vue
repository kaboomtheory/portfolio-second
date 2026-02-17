<script setup lang="ts">
const { friends } = useMockContent()

const selectedTag = ref('All')

const tags = computed(() => ['All', ...new Set(friends.flatMap((item) => item.tags))])

const filteredFriends = computed(() => {
  if (selectedTag.value === 'All') {
    return friends
  }

  return friends.filter((item) => item.tags.includes(selectedTag.value))
})

useHead({ title: 'Friends' })
</script>

<template>
  <div class="page-content">
    <PageHeader
      title="Friends"
      description="Placeholder network directory with tag filters and profile cards."
    />

    <section class="page-section pt-0">
      <ul class="filter-row">
        <li v-for="tag in tags" :key="tag">
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill-active': selectedTag === tag }"
            :style="{
              opacity: selectedTag === tag ? '1' : '0.78',
            }"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
        </li>
      </ul>

      <div class="grid gap-4 sm:grid-cols-2">
        <a
          v-for="friend in filteredFriends"
          :key="friend.name"
          :href="friend.link"
          target="_blank"
          rel="noopener noreferrer"
          class="card-surface flex gap-4 p-4 transition-transform duration-200 hover:-translate-y-1"
        >
          <img :src="friend.image" :alt="friend.name" loading="lazy" class="h-16 w-16 rounded-lg object-cover">
          <div class="space-y-1">
            <h2 class="text-xl">{{ friend.name }}</h2>
            <p class="text-sm">{{ friend.title }}</p>
            <div class="flex flex-wrap gap-2 pt-1">
              <span v-for="tag in friend.tags" :key="tag" class="tag-chip">{{ tag }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
