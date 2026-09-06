"use client";

import * as React from "react";
import { Gift, Copy, Check, Users, Sparkles, Trophy, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Badge } from "@/ui/primitives/badge";
import { Progress } from "@/ui/primitives/progress";
import { Card } from "@/ui/primitives/card";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [copied, setCopied] = React.useState(false);
  const inviteCode = "YUKA-COLLECTOR-892";
  const inviteUrl = `https://yukatrendz.com/vip?invite=${inviteCode}`;

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const milestones = [
    { referrals: 1, reward: "₹1,000 Discount Voucher", completed: true },
    { referrals: 3, reward: "Exclusive Gift Box & Priority Access", completed: false },
    { referrals: 5, reward: "VIP Free Express Shipping for 1 Year", completed: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <Gift className="h-4 w-4" />
            </div>
            <Badge variant="brand" size="sm">
              Referral Rewards
            </Badge>
          </div>
          <DialogTitle className="font-sans text-2xl font-bold tracking-tight text-foreground pt-1">
            Refer a Friend &amp; Get ₹1,000
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Share your unique invite link with friends and family. When they make their first purchase, you both receive a ₹1,000 discount voucher on your next order!
          </DialogDescription>
        </DialogHeader>

        {/* 1-Click Copy Invitation Box */}
        <div className="mt-4 p-4 rounded-xl border border-brand-500/30 bg-brand-50/40 dark:bg-brand-950/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-800 dark:text-brand-300">
              Your Referral Link
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              Code: {inviteCode}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={inviteUrl}
              className="text-xs font-mono bg-background select-all"
            />
            <Button
              type="button"
              variant={copied ? "secondary-gray" : "primary"}
              size="sm"
              onClick={copyInvite}
              className="shrink-0 gap-1.5 text-xs shadow-unt-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Milestone Progression */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              Reward Milestones
            </span>
            <span className="text-muted-foreground">1 of 5 Friends Invited</span>
          </div>

          <Progress value={20} className="h-1.5" />

          <div className="space-y-2 pt-1">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                  m.completed
                    ? "border-success-300 bg-success-50/50 dark:border-success-900 dark:bg-success-950/20"
                    : "border-border/60 bg-card/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      m.completed
                        ? "bg-success-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.completed ? <Check className="h-3 w-3" /> : m.referrals}
                  </div>
                  <span className="font-medium text-foreground">
                    {m.reward}
                  </span>
                </div>
                <Badge
                  variant={m.completed ? "success" : "gray"}
                  size="sm"
                  dot={m.completed}
                >
                  {m.completed ? "Unlocked" : `${m.referrals} Friends`}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Social Sharing / Fast Action */}
        <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Over 1,500 members joined this month
          </span>
          <Button variant="secondary-gray" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
