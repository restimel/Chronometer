<template>
    <div v-if="internalOpen"
        class="mask"
        @click.self.prevent.stop="cancel"
    >
        <dialog
            :open="internalOpen"
            class="confirm-dialog"
        >
            <div class="content">
                <slot/>
            </div>
            <footer class="dialog-footer">
                <button
                    class="cancel-btn"
                    @click.prevent.stop="cancel"
                >
                    Cancel
                </button>
                <button
                    class="Approve-btn"
                    @click.prevent.stop="approve"
                >
                    Ok
                </button>
            </footer>
        </dialog>
    </div>
</template>

<script>
export default {
    name: 'ConfirmDialog',
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            internalOpen: this.open,
        };
    },
    methods: {
        cancel() {
            this.internalOpen = false;
            this.$emit('cancel');
        },
        approve() {
            this.internalOpen = false;
            this.$emit('ok');
        },
        actionKey(evt) {
            const code = evt.code;

            switch (code) {
                case 'Enter':
                    this.approve();
                    break;
                case 'Escape':
                    this.cancel();
                    break;
                default:
                    return;
            }
            evt.preventDefault();
            evt.stopPropagation();
        },
        addListeners() {
            document.body.addEventListener('keydown', this.actionKey, true);
        },
        removeListeners() {
            document.body.removeEventListener('keydown', this.actionKey, true);
        },
    },
    watch: {
        open() {
            this.internalOpen = this.open;
        },
        internalOpen() {
            if (this.internalOpen) {
                this.addListeners();
            } else {
                this.removeListeners();
            }
        },
    },
    created() {
        if (this.internalOpen) {
            this.addListeners();
        }
    },
    destroyed() {
        this.removeListeners();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.confirm-dialog {
    position: fixed;
    z-index: 1000;
    top: 50%;
    transform: translate(0, -50%);
    max-height: 95%;
    max-width: 95%;
    padding: 25px;
    box-shadow: 2px 5px 25px 2px black;
}
.content {
    padding: 5px;
}
.content input {
    margin-left: 5px;
}
.dialog-footer {
    margin-top: 15px;
}
.dialog-footer > button {
    font-size: 1.05em;
    margin-right: 20px;
    margin-left: 20px;
    cursor: pointer;
}
.mask {
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(150, 150, 150, 0.5);
}
</style>
