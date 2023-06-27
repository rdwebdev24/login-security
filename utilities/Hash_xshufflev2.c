
/***************************************************

COMPILE: gcc Hash_xshuffle.c -lssl -lcrypto
****************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <openssl/sha.h>
#include <string.h>


uint32_t murmur2(const void* key, int len, uint32_t seed) {
    const uint32_t m = 0x5bd1e995;
    const int r = 24;

    uint32_t h = seed ^ len;

    const uint8_t* data = (const uint8_t*)key;

    while (len >= 4) {
        uint32_t k = *(uint32_t*)data;

        k *= m;
        k ^= k >> r;
        k *= m;

        h *= m;
        h ^= k;

        data += 4;
        len -= 4;
    }

    switch (len) {
        case 3:
            h ^= data[2] << 16;
        case 2:
            h ^= data[1] << 8;
        case 1:
            h ^= data[0];
            h *= m;
    };

    h ^= h >> 13;
    h *= m;
    h ^= h >> 15;

    return h;
}

unsigned int getSeedValue(char *key, int l, unsigned int seed, int t)
{
	int i;
	int j=0;
	for (i = 0; i < t; i++)
	{
		seed = (unsigned int)murmur2(key, l, seed);
		// printf("seed : %u\n", seed);
	}

	return seed;
}

void shift(char *str, int i, int l)
{
	int j;
	for (j = i; j < l; j++)
		str[j] = str[j + 1];
	str[j] = '\0';
}

void copy(char *dest, char *src, int l)
{
	int i;
	for (i = 0; i < l; i++)
		dest[i] = src[i];
	dest[i] = '\0';
}
void insertCharAt(char str[], int l, char c, int pos)
{
	int i;
	// for(l=0;str[l]!='\0';l++);
	for (i = l; i > pos; i--)
		str[i] = str[i - 1];
	str[i] = c;
	// str[l+1]='\0';
}

void shuffle(char *str1, int l1, char *str2, int l2, char *ctx, int l3, unsigned int seed, char *mix)
{
	int i, k, t = 16, d = 1783;
	char s1[1024], s2[1024], s3[1024];
	int ll1 = l1, ll2 = l2, ll3 = l3;
	copy(s1, str1, l1);
	copy(s2, str2, l2);
	copy(s3, ctx, l3);
	

	seed = getSeedValue(ctx, l3, seed, t);
	t = seed % d + 16; // t=seed%37+16
	seed = getSeedValue(str1, l1, seed, t);
	t = seed % d + 16;
	seed = getSeedValue(str2, l2, seed, t);
	t = seed % d + 16;

	i = 0;
	while (ll1 != 0 && ll2 != 0)
	{
		if ((seed & 1) == 0)
		{
			seed = getSeedValue(str2, l2, seed, t);
			t = seed % d + 16;
			seed = getSeedValue(str1, l1, seed, t);
			t = seed % d + 16;
			seed = getSeedValue(ctx, l3, seed, t);
			t = seed % d + 16;
			k = seed % ll1;
			mix[i++] = s1[k];
			shift(s1, k, ll1);
			ll1--;
		}
		else
		{
			seed = getSeedValue(str2, l2, seed, t);
			t = seed % d + 16;
			seed = getSeedValue(str1, l1, seed, t);
			t = seed % d + 16;
			seed = getSeedValue(ctx, l3, seed, t);
			t = seed % d + 16;
			k = seed % ll2;
			mix[i++] = s2[k];
			shift(s2, k, ll2);
			ll2--;
		}
	}
	for (k = 0; k < ll1; k++)
	{
		seed = getSeedValue(str2, l2, seed, t);
		t = seed % d + 16;
		seed = getSeedValue(str1, l1, seed, t);
		t = seed % d + 16;
		seed = getSeedValue(ctx, l3, seed, t);
		t = seed % d + 16;
		int pos = seed % i;
		insertCharAt(mix, i, s1[k], pos);
		i++;
	}

	for (k = 0; k < ll2; k++)
	{
		seed = getSeedValue(str2, l2, seed, t);
		t = seed % d + 16;
		seed = getSeedValue(str1, l1, seed, t);
		t = seed % d + 16;
		seed = getSeedValue(ctx, l3, seed, t);
		t = seed % d + 16;
		int pos = seed % i;
		insertCharAt(mix, i, s2[k], pos);
		i++;
	}
	mix[i] = '\0';

	// printf("\nFirst String: %s\n", str1);
	// printf("Second String: %s\n", str2);
	// printf("Context String: %s\n", ctx);
	printf("Shuffled String: %s\n\n", mix);
}

int main()
{

	char mix[1024];
	int i;
	// User ID change
	// password hashing
	char p1[1024] = "Pass@1975";
	char p2[1024] = "mydomain.com";
	char ctxp[1024] = "Xyz@2023";

	// User ID hashing
	char u1[1024] = "Xyz@2023";
	char u2[1024] = "mydomain.com";
	char ctxu[1024] = "Pass@1975";

	// Key hashing
	char k1[1024] = "Xyz@2023";
	char k2[1024] = "Pass@1975mydomain.com";
	char ctxk[1024] = "Pass@1975Xyz@2023";

	unsigned int seed = 198899;
	int l1, l2, l3;
	unsigned char *d;

	printf("\nShuffling for user ID\n");
	for (l1 = 0; u1[l1] != '\0'; l1++);
	for (l2 = 0; u2[l2] != '\0'; l2++);
	for (l3 = 0; ctxu[l3] != '\0'; l3++);
	shuffle(u1, l1, u2, l2, ctxu, l3, seed, mix);

	// d = SHA256(mix, strlen(mix), 0);
	// printf("The SHA256 hash value:");
	// for (i = 0; i < SHA256_DIGEST_LENGTH; i++)
	// 	printf("%02x", d[i]);
	// printf("\n");

	// printf("\nShuffling for password");
	// for (l1 = 0; p1[l1] != '\0'; l1++)
	// 	;
	// for (l2 = 0; p2[l2] != '\0'; l2++)
	// 	;
	// for (l3 = 0; ctxp[l3] != '\0'; l3++)
	// 	;
	// shuffle(p1, l1, p2, l2, ctxp, l3, seed, mix);

	// d = SHA256(mix, strlen(mix), 0);
	// printf("The SHA256 hash value:");
	// for (i = 0; i < SHA256_DIGEST_LENGTH; i++)
	// 	printf("%02x", d[i]);
	// printf("\n");

	// printf("\nShuffling for key");
	// for (l1 = 0; k1[l1] != '\0'; l1++)
	// 	;
	// for (l2 = 0; k2[l2] != '\0'; l2++)
	// 	;
	// for (l3 = 0; ctxk[l3] != '\0'; l3++)
	// 	;
	// shuffle(k1, l1, k2, l2, ctxk, l3, seed, mix);

	// d = SHA256(mix, strlen(mix), 0);
	// printf("The SHA256 hash value:");
	// for (i = 0; i < SHA256_DIGEST_LENGTH; i++)
	// 	printf("%02x", d[i]);
	// printf("\n");

	return 0;
}
