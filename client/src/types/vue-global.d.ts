import type { EventTypes } from '@/plugins/eventEmitter'
import type { Emitter } from 'mitt'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $event: Emitter<EventTypes>['emit']
    $listen: Emitter<EventTypes>['on']
    $unsubscribe: Emitter<EventTypes>['off']
  }
}
