<template>
   <div>
        <table v-if="timeList.length > 0"
           class="record-table"
        >
            <thead>
                <tr>
                    <th>
                        Time
                    </th>
                    <th>
                        Time since last record
                    </th>
                    <th>
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, idx) of reversedList"
                    :key="`record-value-${idx}`"
                >
                    <td>
                        <DigitalTimer
                            :value="record"
                            :timeFormat="timeFormat"
                            inline
                        />
                    </td>
                    <td>
                        <DigitalTimer
                            :value="getDiff(idx)"
                            :timeFormat="timeFormat"
                            inline
                        />
                    </td>
                    <td>
                        <button
                            class="icon"
                            title="remove this record"
                            @click="remove(idx)"
                        >
                            ✖
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import DigitalTimer from '@/components/DigitalTimer.vue';

export default {
    name: 'recordtable',
    props: {
        timeList: {
            type: Array,
            required: true,
        },
        timeFormat: {
            type: String,
            resquired: true,
        },
    },
    data() {
        return {

        };
    },
    computed: {
        reversedList() {
            return Array.from(this.timeList).reverse();
        },
    },
    methods: {
        getDiff(index) {
            const list = this.reversedList;
            const value1 = list[index];
            const value2 = list[index + 1] || 0;
            const time = Math.abs(value1 - value2);

            return time;

        },
        realindex(index) {
            const length = this.reversedList.length;
            return length - index - 1;
        },
        remove(idx) {
            this.$emit('remove', this.realindex(idx));
        },
    },
    watch: {
    },
    components: {
        DigitalTimer,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.record-table {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
</style>
