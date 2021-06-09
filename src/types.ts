export interface TooltipOptions {
  name?: string
  color?: string
  background?: string
  borderRadius?: number
  fontWeight?: number
}

export const defaultTooltipOptions: TooltipOptions = {
  name: 'VueCustomTooltip',
  color: '#fff',
  background: '#000',
  borderRadius: 100,
  fontWeight: 400,
}
