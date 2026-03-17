package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type tokenBucket struct {
	tokens   float64
	maxTokens float64
	refillRate float64
	lastRefill time.Time
	mu        sync.Mutex
}

func newTokenBucket(rps int) *tokenBucket {
	return &tokenBucket{
		tokens:     float64(rps),
		maxTokens:  float64(rps),
		refillRate: float64(rps),
		lastRefill: time.Now(),
	}
}

func (tb *tokenBucket) allow() bool {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(tb.lastRefill).Seconds()
	tb.tokens = min(tb.maxTokens, tb.tokens+elapsed*tb.refillRate)
	tb.lastRefill = now

	if tb.tokens >= 1 {
		tb.tokens--
		return true
	}
	return false
}

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}

func RateLimiter(rps int) gin.HandlerFunc {
	var buckets sync.Map
	return func(c *gin.Context) {
		ip := c.ClientIP()
		v, _ := buckets.LoadOrStore(ip, newTokenBucket(rps))
		bucket := v.(*tokenBucket)
		if !bucket.allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": gin.H{
					"code":    "RATE_LIMIT_EXCEEDED",
					"message": "too many requests",
				},
			})
			return
		}
		c.Next()
	}
}
