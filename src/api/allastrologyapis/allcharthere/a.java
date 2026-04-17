import java.util.*;

public class Main {

    public static int solve(int[] lamps) {
        int n = lamps.length;

        Map<Integer, List<Integer>> map = new HashMap<>();

        for (int i = 0; i < n; i++) {
            map.computeIfAbsent(lamps[i], k -> new ArrayList<>()).add(i);
        }

        int answer = Integer.MAX_VALUE;

        for (List<Integer> indices : map.values()) {

            if (indices.size() == n)
                return 0;

            int maxGap = 0;

            for (int i = 1; i < indices.size(); i++) {
                maxGap = Math.max(maxGap,
                        indices.get(i) - indices.get(i - 1) - 1);
            }

            maxGap = Math.max(maxGap,
                    indices.get(0) + n - indices.get(indices.size() - 1) - 1);

            int nights = (maxGap + 1) / 2;

            answer = Math.min(answer, nights);
        }

        return answer;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String[] parts = sc.nextLine().split(" ");
        int[] lamps = new int[parts.length];

        for (int i = 0; i < parts.length; i++)
            lamps[i] = Integer.parseInt(parts[i]);

        System.out.println(solve(lamps));
    }
}