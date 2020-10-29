export default interface ICacheProvider {
  recover(key: string): Promise<string | null>
  save(key: string, value: string): Promise<void>
  invalidate(key: string): Promise<void>
}
