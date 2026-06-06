import type { Metadata } from "next";
import { Users, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "社群討論" };

const POSTS = [
  {
    id: 1,
    title: "GR86 vs BRZ 深度對比：兩兄弟到底選哪台？",
    author: "speed_king",
    views: 12450,
    replies: 234,
    tags: ["跑車", "Toyota", "Subaru"],
    hot: true,
  },
  {
    id: 2,
    title: "RAV4 Hybrid vs CX-5 2.5T：家庭SUV終極選擇指南",
    author: "family_driver",
    views: 9830,
    replies: 187,
    tags: ["SUV", "油電"],
    hot: true,
  },
  {
    id: 3,
    title: "2024 年購車心得：BMW 3系列首年使用報告",
    author: "bmw_fan_tw",
    views: 6720,
    replies: 98,
    tags: ["BMW", "使用心得"],
    hot: false,
  },
  {
    id: 4,
    title: "純電車充電焦慮解決方案分享",
    author: "ev_lover",
    views: 5490,
    replies: 145,
    tags: ["電動車", "充電"],
    hot: false,
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-500" />
            車主社群
          </h1>
          <p className="text-zinc-500">分享用車心得，交流購車經驗</p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4" />
          發表文章
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users, label: "會員人數", value: "12,840" },
          { icon: MessageSquare, label: "討論文章", value: "38,920" },
          { icon: Star, label: "車主評價", value: "96,340" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="text-center p-4">
            <Icon className="h-5 w-5 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-zinc-100">{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-orange-500" />
          <h2 className="font-semibold text-zinc-300">熱門討論</h2>
        </div>
        {POSTS.map((post) => (
          <Card
            key={post.id}
            className="hover:border-zinc-600 transition-colors cursor-pointer group"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.hot && (
                      <Badge variant="default" className="text-xs">🔥 熱門</Badge>
                    )}
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    by <span className="text-zinc-500">{post.author}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-zinc-300">{post.replies} 回覆</div>
                  <div className="text-xs text-zinc-600">{post.views.toLocaleString()} 瀏覽</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center py-12 border border-dashed border-zinc-700 rounded-xl">
        <p className="text-zinc-500 mb-3">社群功能完整開發中（Phase 3）</p>
        <p className="text-sm text-zinc-600">包含：車主評價、車庫管理、即時聊天室</p>
      </div>
    </div>
  );
}
