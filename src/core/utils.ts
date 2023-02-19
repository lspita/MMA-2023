export default class Utils {
    static random<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }
}